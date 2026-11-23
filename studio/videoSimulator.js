const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getFfmpegPath } = require('./videoExtractor');

/**
 * Creates a cinematic MP4 clip from a seed image or frame
 * with 24/30fps film cadence so that the user has actual
 * downloadable .mp4 video clips even before running Google Flow!
 */
function createCinematicVideoBit(imagePath, outputPath, durationSec = 4) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const ffmpeg = getFfmpegPath();

  const cmd = `${ffmpeg} -y -loop 1 -i "${imagePath}" -c:v libx264 -t ${durationSec} -pix_fmt yuv420p -vf "scale=1920:1080" -r 30 "${outputPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });
    return fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0;
  } catch (err) {
    console.error(`[VideoSimulator] Failed to synthesize clip: ${err.message}`);
    return false;
  }
}

module.exports = {
  createCinematicVideoBit
};
