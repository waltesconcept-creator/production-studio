const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Locate ffmpeg binary
function getFfmpegPath() {
  const localRemotionFfmpeg = path.resolve(
    __dirname,
    '../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
  );
  if (fs.existsSync(localRemotionFfmpeg)) {
    return `"${localRemotionFfmpeg}"`;
  }
  return 'npx remotion ffmpeg';
}

/**
 * Extracts key reference frames from an uploaded video.
 * @param {string} videoPath - Absolute path to video file
 * @param {string} outputDir - Directory to save extracted JPGs
 * @param {number[]} timestamps - Array of timestamps in seconds
 * @returns {Array<{timestamp: number, framePath: string, filename: string}>}
 */
function extractVideoFrames(videoPath, outputDir, timestamps = [1.0, 3.0, 6.0, 9.0]) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ffmpeg = getFfmpegPath();
  const baseName = path.basename(videoPath, path.extname(videoPath));
  const extracted = [];

  for (let i = 0; i < timestamps.length; i++) {
    const t = timestamps[i];
    const outFilename = `${baseName}_frame_${i + 1}_${t}s.jpg`;
    const outPath = path.join(outputDir, outFilename);

    try {
      const cmd = `${ffmpeg} -y -ss ${t} -i "${videoPath}" -vframes 1 -q:v 2 "${outPath}"`;
      execSync(cmd, { stdio: 'pipe' });

      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
        extracted.push({
          timestamp: t,
          framePath: outPath,
          filename: outFilename,
          relativePath: `/assets/uploads/${outFilename}`
        });
      }
    } catch (err) {
      console.warn(`[FrameExtractor] Frame at ${t}s failed:`, err.message);
    }
  }

  return extracted;
}

module.exports = {
  extractVideoFrames,
  getFfmpegPath
};
