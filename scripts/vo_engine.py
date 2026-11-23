"""
Natural Human-Storyteller Nigerian Voiceover Engine.
Generates en-NG neural audio at energetic narrative pacing (~155-160 WPM)
with natural human breathing pauses:
- Clauses / commas / dashes: ~0.24s (holding breath)
- Sentence ends / full stops: ~0.44s (natural breath reset)
- Dramatic pivots / scene turns: ~0.62s (theatrical weight & suspense)
- Inside sentence: natural fluid word transitions (0.03s-0.08s)
Maintains smooth crossfades, clean audio joins, and exact millisecond word timestamps.
"""
import asyncio
import json
import os
import subprocess
import numpy as np
import edge_tts
from scipy.io import wavfile

SR = 44100
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_ffmpeg():
    c = os.path.join(BASE_DIR, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe")
    return c if os.path.exists(c) else "ffmpeg"


def map_paragraphs_to_tokens(paragraphs_config):
    """
    Given a list of (text, is_dramatic) tuples, splits into tokens and categorizes
    punctuation types: 'dramatic', 'sentence', 'clause', or 'normal'.
    """
    tokens = []
    for text, is_dramatic in paragraphs_config:
        words = text.split()
        for idx, w in enumerate(words):
            is_last_in_para = (idx == len(words) - 1)
            clean = w.strip(".,?!'\"—:-").lower()

            if is_last_in_para and is_dramatic:
                p_type = "dramatic"
            elif w.endswith((".", "?", "!")) and clean != "mr":
                p_type = "sentence"
            elif w.endswith((",", "—", ":", ";")) or "—" in w:
                p_type = "clause"
            else:
                p_type = "normal"

            tokens.append({
                "raw": w,
                "clean": clean,
                "p_type": p_type,
            })
    return tokens


def apply_human_storyteller_timing(audio: np.ndarray, tts_words: list, tokens: list):
    """
    Applies 4-tiered human breathing cadence to TTS audio based on script punctuation.
    Remaps all word timestamps and joins audio chunks with micro-crossfades to eliminate digital clicks.
    """
    if not tts_words:
        return audio, tts_words

    # Align TTS words with script tokens
    t_idx = 0
    for w in tts_words:
        w_clean = w["text"].lower().strip(".,?!'\"—:-")
        matched = False
        for lookahead in range(t_idx, min(len(tokens), t_idx + 4)):
            t = tokens[lookahead]
            if t["clean"] == w_clean or w_clean in t["clean"] or t["clean"] in w_clean:
                w["p_type"] = t["p_type"]
                w["raw"] = t["raw"]
                t_idx = lookahead + 1
                matched = True
                break
        if not matched:
            w["p_type"] = "normal"
            w["raw"] = w["text"]

    fade_n = int(0.010 * SR)
    chunks = []
    remapped = []

    # Natural head trim (keep max 0.08s of lead room before first word)
    lead_cut = max(0.0, tts_words[0]["start"] - 0.08)
    src_cursor = int(lead_cut * SR)
    out_cursor = 0

    for i, w in enumerate(tts_words):
        w_start_i = int(w["start"] * SR)
        w_end_i = int(w["end"] * SR)
        next_start_i = int(tts_words[i + 1]["start"] * SR) if i + 1 < len(tts_words) else len(audio)

        # Pad slightly after word to preserve natural phonetic trailing releases
        pad_after = min(int(0.045 * SR), max(0, (next_start_i - w_end_i) // 2))
        seg_end = min(len(audio), max(w_end_i + pad_after, src_cursor))
        seg = audio[src_cursor:seg_end].copy()

        # Micro-fades to eliminate digital clicks
        if len(seg) > 2 * fade_n and chunks:
            seg[:fade_n] *= np.linspace(0.0, 1.0, fade_n)
        if len(seg) > 2 * fade_n:
            seg[-fade_n:] *= np.linspace(1.0, 0.0, fade_n)

        new_start = (out_cursor + (w_start_i - src_cursor)) / SR
        new_dur = w["duration"]
        remapped.append({
            "text": w["text"],
            "start": round(max(0.0, new_start), 4),
            "duration": round(new_dur, 4),
            "end": round(max(0.0, new_start + new_dur), 4),
            "p_type": w.get("p_type", "normal"),
        })

        chunks.append(seg)
        out_cursor += len(seg)

        if i + 1 < len(tts_words):
            raw_gap = (next_start_i - seg_end) / SR
            ptype = w.get("p_type", "normal")

            if ptype == "dramatic":
                target_gap = 0.62  # Theatrical storytelling pause
            elif ptype == "sentence":
                target_gap = 0.44  # Natural sentence breath pause
            elif ptype == "clause":
                target_gap = min(raw_gap, 0.25)  # Natural comma / clause breath
            else:
                target_gap = min(raw_gap, 0.075)  # Fluid word transition inside sentence

            pad_len = int(target_gap * SR)
            if pad_len > 0:
                chunks.append(np.zeros(pad_len, dtype=np.float64))
                out_cursor += pad_len
            src_cursor = next_start_i
        else:
            # Clean tail room (~0.55s) after the final word
            tail = audio[seg_end : min(len(audio), seg_end + int(0.55 * SR))].copy()
            if len(tail) > 0:
                chunks.append(tail)
                out_cursor += len(tail)

    tightened = np.concatenate(chunks) if chunks else audio
    return tightened, remapped


async def generate_human_storyteller_vo(
    reel_id: str,
    paragraphs_config: list,
    voice: str = "en-NG-AbeoNeural",
    rate: str = "+7%",
    pitch: str = "-1Hz",
):
    """
    High-level generator that synthesizes neural TTS with natural human breathing cadence.
    """
    raw_mp3 = os.path.join(BASE_DIR, "scratch", f"{reel_id}_raw.mp3")
    raw_wav = os.path.join(BASE_DIR, "scratch", f"{reel_id}_raw.wav")
    tight_wav = os.path.join(BASE_DIR, "public", "audio", f"{reel_id}_vo_tight.wav")
    out_json = os.path.join(BASE_DIR, "src", f"{reel_id}_timing.json")
    os.makedirs(os.path.dirname(raw_mp3), exist_ok=True)
    os.makedirs(os.path.dirname(tight_wav), exist_ok=True)

    # Build paragraph-separated text for natural prosody
    full_text = "\n\n".join([p[0] for p in paragraphs_config])
    tokens = map_paragraphs_to_tokens(paragraphs_config)

    comm = edge_tts.Communicate(
        full_text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        boundary="WordBoundary",
    )
    words = []
    audio_bytes = bytearray()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            s = chunk["offset"] / 10_000_000.0
            d = chunk["duration"] / 10_000_000.0
            words.append({"text": chunk["text"], "start": s, "duration": d, "end": s + d})

    with open(raw_mp3, "wb") as f:
        f.write(audio_bytes)

    ffmpeg = find_ffmpeg()
    subprocess.run(
        [ffmpeg, "-y", "-i", raw_mp3, "-ar", str(SR), "-ac", "1", raw_wav],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    _, raw_samples = wavfile.read(raw_wav)
    audio_f = raw_samples.astype(np.float64) / 32768.0

    human_audio, human_words = apply_human_storyteller_timing(audio_f, words, tokens)

    human_audio = np.clip(human_audio, -1.0, 1.0)
    wavfile.write(tight_wav, SR, (human_audio * 32767.0).astype(np.int16))

    for tmp in (raw_mp3, raw_wav):
        if os.path.exists(tmp):
            os.remove(tmp)

    total_dur = round(len(human_audio) / SR + 0.65, 3)
    payload = {
        "id": reel_id,
        "voice": voice,
        "rate": rate,
        "fullText": full_text,
        "totalDurationSeconds": total_dur,
        "words": human_words,
    }
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    wpm = len(human_words) / (max(0.1, human_words[-1]["end"]) / 60.0) if human_words else 0
    print(f"Generated {tight_wav} | {len(human_words)} words | {total_dur:.2f}s | ~{wpm:.0f} WPM")
    return payload
