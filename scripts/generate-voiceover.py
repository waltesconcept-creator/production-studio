#!/usr/bin/env python3
"""
Free Production-Grade Neural TTS Voiceover Generator
Uses Microsoft Edge TTS (100% free, no API key, no credit card, unlimited).

Outputs:
  - MP3 audio track saved to public/audio/voiceover.mp3
  - Remotion-ready caption & timing manifest with frame-accurate sync
"""

import sys
import os
import argparse
import asyncio
import json
import edge_tts

VOICE_PRESETS = {
  "documentary-deep": "en-US-ChristopherNeural",   # Deep authoritative narrator (Vox/Frontline/ColdFusion)
  "documentary-clear": "en-US-EricNeural",         # Modern clear narrator
  "documentary-warm": "en-US-JennyNeural",         # Warm engaging female voice
  "british-narrator": "en-GB-RyanNeural",          # BBC style British narrator
  "tech-news": "en-US-GuyNeural"                   # Punchy tech news style
}

async def generate_voiceover(text, voice="en-US-ChristopherNeural", output_audio="public/audio/voiceover.mp3", fps=30):
    os.makedirs(os.path.dirname(output_audio), exist_ok=True)
    
    print(f"🎙️ Generating voiceover using voice: {voice}")
    communicate = edge_tts.Communicate(text, voice)
    
    sentences = []
    audio_bytes = bytearray()
    
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            # offset and duration in 100ns (ticks)
            start_ms = chunk["offset"] / 10000
            duration_ms = chunk["duration"] / 10000
            end_ms = start_ms + duration_ms
            
            start_frame = int(round((start_ms / 1000) * fps))
            end_frame = int(round((end_ms / 1000) * fps))
            
            raw_text = chunk["text"].strip()
            words_list = raw_text.split()
            word_count = max(1, len(words_list))
            word_duration = (end_frame - start_frame) / word_count
            
            words_timing = []
            for i, w in enumerate(words_list):
                w_start = int(round(start_frame + i * word_duration))
                w_end = int(round(start_frame + (i + 1) * word_duration))
                words_timing.append({
                    "word": w,
                    "startFrame": w_start,
                    "endFrame": w_end
                })
            
            sentences.append({
                "id": f"cap-{len(sentences) + 1}",
                "startFrame": start_frame,
                "endFrame": end_frame,
                "startMs": start_ms,
                "endMs": end_ms,
                "text": raw_text,
                "words": words_timing
            })
            
    with open(output_audio, "wb") as f:
        f.write(audio_bytes)
        
    total_frames = sentences[-1]["endFrame"] + 15 if sentences else 90
    duration_sec = total_frames / fps
    
    manifest = {
        "audioFile": output_audio.replace("public/", "/"),
        "voice": voice,
        "fps": fps,
        "durationSeconds": round(duration_sec, 2),
        "totalFrames": total_frames,
        "captions": sentences
    }
    
    json_path = output_audio.replace(".mp3", "-manifest.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        
    print(f"✅ Voiceover audio saved: {output_audio}")
    print(f"✅ Timing manifest saved: {json_path}")
    print(f"⏱️ Duration: {duration_sec:.2f}s ({total_frames} frames @ {fps}fps, {len(sentences)} segments)")
    return manifest

def main():
    parser = argparse.ArgumentParser(description="Free TTS Voiceover & Timings Generator")
    parser.add_argument("--text", type=str, help="Text to speak")
    parser.add_argument("--file", type=str, help="Text file containing script")
    parser.add_argument("--preset", type=str, default="documentary-deep", choices=list(VOICE_PRESETS.keys()))
    parser.add_argument("--output", type=str, default="public/audio/voiceover.mp3")
    parser.add_argument("--fps", type=int, default=30)
    
    args = parser.parse_args()
    
    if args.file and os.path.exists(args.file):
        with open(args.file, "r", encoding="utf-8") as f:
            script_text = f.read()
    elif args.text:
        script_text = args.text
    else:
        script_text = (
            "In 1993, three engineers met at a Denny's diner in Silicon Valley. "
            "They had no money, no offices, and no venture backing. "
            "Thirty years later, their single bet on parallel computing would spark the trillion-dollar artificial intelligence revolution."
        )
        
    voice = VOICE_PRESETS.get(args.preset, "en-US-ChristopherNeural")
    asyncio.run(generate_voiceover(script_text, voice=voice, output_audio=args.output, fps=args.fps))

if __name__ == "__main__":
    main()
