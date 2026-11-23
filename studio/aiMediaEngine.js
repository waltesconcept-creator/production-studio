const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GoogleAIBridge = require('./googleAiBridge');

/**
 * Enterprise AI Media Engine
 * Multi-Provider Architecture supporting:
 * 1. Google Gemini (Story Brain & Screenplay)
 * 2. Google Nano Banana 2 / Imagen 3 (Pay-as-you-go)
 * 3. Fal.ai (InstantID, Flux 1.1 Pro, Kling 1.5 Video, Luma Ray 2)
 * 4. Replicate (Flux, InstantID, Minimax Hailuo Video)
 */
class AIMediaEngine {
  /**
   * Determine active providers and credentials
   */
  static getProviders() {
    return {
      google: {
        configured: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
        key: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null
      },
      fal: {
        configured: !!process.env.FAL_KEY,
        key: process.env.FAL_KEY || null
      },
      replicate: {
        configured: !!process.env.REPLICATE_API_TOKEN,
        key: process.env.REPLICATE_API_TOKEN || null
      }
    };
  }

  /**
   * 1. STORY BRAIN: Deconstruct raw idea into cinematic screenplay beats
   */
  static async analyzeStory(title, synopsis, genre, aspectRatio = '16:9') {
    const providers = this.getProviders();
    if (!providers.google.configured) {
      throw new Error('MISSING_API_KEY: Please configure a Google Gemini API Key in .env to run Story Brain analysis.');
    }
    return await GoogleAIBridge.analyzeStory(title, synopsis, genre, providers.google.key);
  }

  /**
   * 2. CHARACTER CONSISTENCY SHEET: Multi-angle face/identity lock
   */
  static async generateCharacterImage({ prompt, outputFilePath, refImagePath, characterMeta }) {
    const providers = this.getProviders();
    const outDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // PATH 1: Fal.ai (InstantID / Flux - Highest commercial identity retention)
    if (providers.fal.configured) {
      console.log('[AIMediaEngine] Routing character synthesis to Fal.ai (Flux InstantID)...');
      return await this.generateViaFalImage({ prompt, outputFilePath, refImagePath, key: providers.fal.key });
    }

    // PATH 2: Replicate (InstantID / Flux)
    if (providers.replicate.configured) {
      console.log('[AIMediaEngine] Routing character synthesis to Replicate (Flux / InstantID)...');
      return await this.generateViaReplicateImage({ prompt, outputFilePath, refImagePath, token: providers.replicate.key });
    }

    // PATH 3: Google Nano Banana 2 / Imagen 3
    if (providers.google.configured) {
      console.log('[AIMediaEngine] Routing character synthesis to Google Nano Banana 2...');
      try {
        await GoogleAIBridge.generateCharacterSheet(prompt, outputFilePath, refImagePath, providers.google.key);
        return {
          success: true,
          provider: 'Google Nano Banana 2',
          outputPath: outputFilePath
        };
      } catch (err) {
        if (err.message.includes('429') || err.message.includes('Quota exceeded') || err.message.includes('limit: 0')) {
          throw new Error('GOOGLE_QUOTA_LOCKED: Your Google AI Studio key is on the Free Tier (Image limit: 0). Enable Pay-As-You-Go in Google AI Studio or add a FAL_KEY / REPLICATE_API_TOKEN to .env.');
        }
        throw err;
      }
    }

    throw new Error('NO_IMAGE_PROVIDER: Please configure Google AI Studio (Pay-As-You-Go), Fal.ai, or Replicate in .env to generate real AI characters.');
  }

  /**
   * 3. SCENE SHEET GENERATION: Environmental, architectural & lighting lock
   */
  static async generateSceneImage({ prompt, outputFilePath, refImagePath, sceneMeta }) {
    const providers = this.getProviders();
    const outDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Fal.ai
    if (providers.fal.configured) {
      return await this.generateViaFalImage({ prompt, outputFilePath, refImagePath, key: providers.fal.key });
    }

    // Replicate
    if (providers.replicate.configured) {
      return await this.generateViaReplicateImage({ prompt, outputFilePath, refImagePath, token: providers.replicate.key });
    }

    // Google Nano Banana 2
    if (providers.google.configured) {
      try {
        await GoogleAIBridge.generateCharacterSheet(prompt, outputFilePath, refImagePath, providers.google.key);
        return {
          success: true,
          provider: 'Google Nano Banana 2',
          outputPath: outputFilePath
        };
      } catch (err) {
        if (err.message.includes('429') || err.message.includes('Quota exceeded') || err.message.includes('limit: 0')) {
          throw new Error('GOOGLE_QUOTA_LOCKED: Your Google AI Studio key is on the Free Tier (Image limit: 0). Enable Pay-As-You-Go in Google AI Studio or add a FAL_KEY / REPLICATE_API_TOKEN to .env.');
        }
        throw err;
      }
    }

    throw new Error('NO_IMAGE_PROVIDER: Please configure Google AI Studio (Pay-As-You-Go), Fal.ai, or Replicate in .env to generate scene sheets.');
  }

  /**
   * 4. REAL AI VIDEO GENERATION: Living cinematic motion (Kling, Luma, Veo, Wan 2.1)
   */
  static async generateVideoClip({ prompt, outputFilePath, seedImagePath, durationSec = 5, onProgress }) {
    const providers = this.getProviders();
    const outDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // PATH 1: Fal.ai (Kling 1.5 / Luma Ray 2 / Minimax - Industry Standard)
    if (providers.fal.configured) {
      console.log('[AIMediaEngine] Submitting video diffusion job to Fal.ai (Kling 1.5 Video)...');
      return await this.generateViaFalVideo({
        prompt,
        outputFilePath,
        seedImagePath,
        durationSec,
        key: providers.fal.key,
        onProgress
      });
    }

    // PATH 2: Replicate (Kling / Minimax / Wan 2.1)
    if (providers.replicate.configured) {
      console.log('[AIMediaEngine] Submitting video diffusion job to Replicate (Kling / Minimax)...');
      return await this.generateViaReplicateVideo({
        prompt,
        outputFilePath,
        seedImagePath,
        durationSec,
        token: providers.replicate.key,
        onProgress
      });
    }

    // PATH 3: Google Veo (Vertex AI Enterprise)
    if (providers.google.configured) {
      try {
        const op = await GoogleAIBridge.generateVideoVeo(prompt, outputFilePath, seedImagePath, providers.google.key);
        return {
          success: true,
          provider: 'Google Veo',
          operation: op
        };
      } catch (err) {
        throw new Error(`GOOGLE_VEO_UNAVAILABLE: Google Veo requires Google Cloud Vertex AI Enterprise permissions. Recommended: add FAL_KEY=... or REPLICATE_API_TOKEN=... to .env for instant Kling 1.5 video generation. Details: ${err.message}`);
      }
    }

    throw new Error('NO_VIDEO_PROVIDER: Video generation requires cloud GPU inference. Please add FAL_KEY=... or REPLICATE_API_TOKEN=... to .env, or upload your rendered .mp4 clips directly.');
  }

  /**
   * Fal.ai Image Generation (Flux 1.1 Pro / InstantID)
   */
  static async generateViaFalImage({ prompt, outputFilePath, refImagePath, key }) {
    let imageUrl = null;

    // If reference image exists, convert to base64 data URI for image-to-image / IP-Adapter
    let imagePayload = null;
    if (refImagePath && fs.existsSync(refImagePath)) {
      const ext = path.extname(refImagePath).toLowerCase().replace('.', '');
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      const b64 = fs.readFileSync(refImagePath).toString('base64');
      imagePayload = `data:${mime};base64,${b64}`;
    }

    const endpoint = imagePayload
      ? 'https://queue.fal.run/fal-ai/flux-general/image-to-image'
      : 'https://queue.fal.run/fal-ai/flux-pro/v1.1';

    const body = imagePayload
      ? { prompt, image_url: imagePayload, strength: 0.65, num_inference_steps: 28, guidance_scale: 3.5 }
      : { prompt, image_size: 'landscape_16_9', num_inference_steps: 30, guidance_scale: 3.5 };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Fal.ai Image API Error (${res.status}): ${errText}`);
    }

    const initial = await res.json();
    let result = initial;

    // If job queued, poll until finished
    if (initial.status_url) {
      result = await this.pollFalJob(initial.status_url, key);
    }

    const genUrl = result.images?.[0]?.url || result.image?.url;
    if (!genUrl) {
      throw new Error('No image URL returned by Fal.ai');
    }

    // Download generated image
    const imgRes = await fetch(genUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(outputFilePath, buffer);

    return {
      success: true,
      provider: 'Fal.ai (Flux 1.1 Pro)',
      outputPath: outputFilePath,
      imageUrl: genUrl
    };
  }

  /**
   * Fal.ai Video Generation (Kling 1.5 / Luma Ray 2)
   */
  static async generateViaFalVideo({ prompt, outputFilePath, seedImagePath, durationSec = 5, key, onProgress }) {
    let imagePayload = null;
    if (seedImagePath && fs.existsSync(seedImagePath)) {
      const ext = path.extname(seedImagePath).toLowerCase().replace('.', '');
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      const b64 = fs.readFileSync(seedImagePath).toString('base64');
      imagePayload = `data:${mime};base64,${b64}`;
    }

    const endpoint = 'https://queue.fal.run/fal-ai/kling-video/v1.5/pro/image-to-video';
    const body = {
      prompt,
      image_url: imagePayload,
      duration: String(Math.min(10, Math.max(5, durationSec))),
      aspect_ratio: '16:9'
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Fal.ai Video API Error (${res.status}): ${errText}`);
    }

    const initial = await res.json();
    const result = await this.pollFalJob(initial.status_url, key, onProgress);

    const videoUrl = result.video?.url;
    if (!videoUrl) {
      throw new Error('No video URL returned by Fal.ai Kling API');
    }

    // Download video file
    const vidRes = await fetch(videoUrl);
    const buffer = Buffer.from(await vidRes.arrayBuffer());
    fs.writeFileSync(outputFilePath, buffer);

    return {
      success: true,
      provider: 'Fal.ai (Kling 1.5 Video)',
      outputPath: outputFilePath,
      videoUrl
    };
  }

  /**
   * Poll Fal.ai async queue until completion
   */
  static async pollFalJob(statusUrl, key, onProgress = null, maxWaitMs = 180000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await fetch(statusUrl, {
        headers: { 'Authorization': `Key ${key}` }
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.status === 'COMPLETED') {
        return data;
      } else if (data.status === 'FAILED') {
        throw new Error(`Fal.ai Job Failed: ${JSON.stringify(data.error || 'Unknown error')}`);
      }

      if (onProgress && data.status) {
        onProgress(data.status, data.logs || []);
      }
    }
    throw new Error('Fal.ai Generation Timed Out after 3 minutes');
  }

  /**
   * Replicate Image Generation (Flux 1.1 Pro)
   */
  static async generateViaReplicateImage({ prompt, outputFilePath, refImagePath, token }) {
    const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '16:9',
          output_format: 'png'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Replicate Image Error (${res.status}): ${errText}`);
    }

    let prediction = await res.json();
    prediction = await this.pollReplicateJob(prediction.urls.get, token);

    const genUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    if (!genUrl) throw new Error('No output image URL from Replicate');

    const imgRes = await fetch(genUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(outputFilePath, buffer);

    return {
      success: true,
      provider: 'Replicate (Flux 1.1 Pro)',
      outputPath: outputFilePath,
      imageUrl: genUrl
    };
  }

  /**
   * Replicate Video Generation (Kling 1.5 / Minimax)
   */
  static async generateViaReplicateVideo({ prompt, outputFilePath, seedImagePath, durationSec = 5, token, onProgress }) {
    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'kuaishou/kling-v1.5',
        input: {
          prompt,
          duration: Math.min(10, Math.max(5, durationSec))
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Replicate Video Error (${res.status}): ${errText}`);
    }

    let prediction = await res.json();
    prediction = await this.pollReplicateJob(prediction.urls.get, token, onProgress);

    const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    if (!videoUrl) throw new Error('No video URL returned by Replicate');

    const vidRes = await fetch(videoUrl);
    const buffer = Buffer.from(await vidRes.arrayBuffer());
    fs.writeFileSync(outputFilePath, buffer);

    return {
      success: true,
      provider: 'Replicate (Kling Video)',
      outputPath: outputFilePath,
      videoUrl
    };
  }

  /**
   * Poll Replicate prediction
   */
  static async pollReplicateJob(getUrl, token, onProgress = null, maxWaitMs = 180000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await fetch(getUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.status === 'succeeded') {
        return data;
      } else if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(`Replicate job ${data.status}: ${data.error || 'Failed'}`);
      }

      if (onProgress) {
        onProgress(data.status, data.logs);
      }
    }
    throw new Error('Replicate Generation Timed Out after 3 minutes');
  }
}

module.exports = AIMediaEngine;
