import os
import subprocess
import glob

ref_dir = r"C:\Users\Tope\.gemini\antigravity\brain\b3489ac7-4051-4964-8697-1a2a5603c8a6\.user_uploaded"
out_dir = r"C:\Users\Tope\.gemini\antigravity\brain\b3489ac7-4051-4964-8697-1a2a5603c8a6\ref_frames"
os.makedirs(out_dir, exist_ok=True)

mp4_files = sorted(glob.glob(os.path.join(ref_dir, "*.mp4")))
print(f"Found {len(mp4_files)} reference videos:")

timestamps = [1.5, 4.0, 8.0]

for idx, video_path in enumerate(mp4_files):
    base_name = f"ref_{idx + 1}"
    print(f"\nExtracting frames for Video {idx + 1}: {os.path.basename(video_path)}...")
    
    for t_idx, t in enumerate(timestamps):
        out_file = os.path.join(out_dir, f"{base_name}_t{t_idx+1}.jpg")
        cmd = f'npx remotion ffmpeg -y -ss {t} -i "{video_path}" -vframes 1 -q:v 2 "{out_file}"'
        try:
            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
                print(f"  + Extracted at {t}s -> {os.path.basename(out_file)} ({os.path.getsize(out_file)} bytes)")
        except Exception as e:
            print(f"  x Failed at {t}s: {e}")

extracted = glob.glob(os.path.join(out_dir, "*.jpg"))
print(f"\n✅ Total extracted reference frames: {len(extracted)}")
