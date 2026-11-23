import asyncio, edge_tts, os
import subprocess

sentences = [
    ("s1_welcome.mp3", "Welcome to Chatty, your all-in-one property assistant on WhatsApp."),
    ("s2_features.mp3", "With Chatty, you can find vacant apartments and short-lets, connect with roommates to split rent, or book inspections right from your chat."),
    ("s3_apartments.mp3", "No more endless browsing on confusing listing websites. Simply tell Chatty what you're looking for, and get verified apartments in seconds."),
    ("s4_roommates.mp3", "Need a roommate? Chatty matches you with verified people so you can split rent together and cut costs in half."),
    ("s5_inspections.mp3", "You can also book a live virtual tour or schedule a physical inspection, with your payment held safely in escrow."),
    ("s6_outro.mp3", "Finding a home shouldn't be stressful. Get started with Chatty by Locari today on WhatsApp.")
]

dest_dir = r"c:\Users\Tope\Downloads\Production Studio\public\audio\chatty"
os.makedirs(dest_dir, exist_ok=True)

ffprobe = r"C:\Users\Tope\Downloads\Production Studio\node_modules\@remotion\compositor-win32-x64-msvc\ffprobe.exe"

async def gen():
    for name, text in sentences:
        p = os.path.join(dest_dir, name)
        comm = edge_tts.Communicate(text, 'en-NG-EzinneNeural', rate="-2%")
        await comm.save(p)
        
        # Get duration
        res = subprocess.run([ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", p], capture_output=True, text=True)
        dur = float(res.stdout.strip()) if res.stdout.strip() else 0
        frames = int(dur * 30)
        print(f"{name:18s}: {dur:.2f}s ({frames} frames)")

asyncio.run(gen())
