const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Attempt to load official Google GenAI SDK
let GoogleGenAI = null;
try {
  const genaiModule = require('@google/genai');
  GoogleGenAI = genaiModule.GoogleGenAI || genaiModule;
} catch (e) {
  console.warn('Note: @google/genai loaded via fallback');
}

class GoogleAIBridge {
  static getApiKey(overrideKey = null) {
    return overrideKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
  }

  /**
   * Real Story Analysis using Google Gemini API
   */
  static async analyzeStory(title, synopsis, genre, apiKey = null) {
    const key = GoogleAIBridge.getApiKey(apiKey);
    if (!key) {
      throw new Error('MISSING_API_KEY: Please provide a Google Gemini API Key to enable live Gemini analysis.');
    }

    const candidateModels = ['gemini-3-flash-preview', 'gemini-flash-lite-latest'];
    const systemPrompt = `You are an elite Hollywood Director, Screenwriter, and Commercial Cinematographer.
Analyze the user's raw, scattered, or conversational idea and transform it into a cinematic screenplay.
Determine the exact optimal number of scenes (between 3 to 10 scenes) based on the story arc.

Format your response as a strict JSON object with this exact structure:
{
  "title": "Clean Cinematic Title",
  "synopsis": "A concise, engaging 1-paragraph logline of the narrative.",
  "beats": [
    {
      "id": "beat-1",
      "title": "Scene 01 // Title",
      "description": "Visual scene action, blocking, and what happens physically.",
      "narration": "Exact cinematic voiceover or character dialogue for this scene.",
      "durationSec": 4
    }
  ]
}`;

    const userPrompt = `Title/Topic: ${title || 'Untitled'}\nGenre: ${genre || 'Cinematic Narrative Commercial'}\nRaw Idea / Brain-Dump:\n${synopsis}`;

    let lastError = null;
    for (const modelName of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Google Gemini API Error (${res.status}): ${errText}`);
        }

        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error('Gemini returned an empty response');
        }

        const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed._model = modelName;
        return parsed;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Engine] Model ${modelName} note: ${err.message}. Trying next available model...`);
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Real Character Sheet Generation using Google Nano Banana 2 (Gemini 3.1 Flash Image)
   */
  static async generateCharacterSheet(promptText, outputFilePath, refImagePath = null, apiKey = null) {
    const key = GoogleAIBridge.getApiKey(apiKey);
    if (!key) {
      throw new Error('MISSING_API_KEY: Please provide a Google Gemini API Key to run live Nano Banana 2 image generation.');
    }

    // Official Google Nano Banana 2 (Gemini 3.1 Flash Image) Endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${key}`;

    const parts = [{ text: promptText }];
    if (refImagePath && fs.existsSync(refImagePath)) {
      const ext = path.extname(refImagePath).toLowerCase().replace('.', '');
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      const b64 = fs.readFileSync(refImagePath).toString('base64');
      parts.unshift({
        inlineData: { mimeType: mime, data: b64 }
      });
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['IMAGE']
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Nano Banana 2 API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const imgPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imgPart?.inlineData?.data) {
      throw new Error('No image returned from Nano Banana 2');
    }

    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    fs.writeFileSync(outputFilePath, Buffer.from(imgPart.inlineData.data, 'base64'));
    return outputFilePath;
  }

  /**
   * Real Video Generation using Google Veo API (veo-3.1-generate-001)
   */
  static async generateVideoVeo(promptText, outputFilePath, seedImagePath = null, apiKey = null) {
    const key = GoogleAIBridge.getApiKey(apiKey);
    if (!key) {
      throw new Error('MISSING_API_KEY: Please provide a Google Gemini API Key to run live Google Veo video generation.');
    }

    // Google Veo Video Generation Endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-001:predictLongRunning?key=${key}`;

    const payload = {
      instances: [
        { prompt: promptText }
      ],
      parameters: {
        aspectRatio: '16:9',
        resolution: '1080p',
        fps: 24,
        durationSeconds: 4
      }
    };

    if (seedImagePath && fs.existsSync(seedImagePath)) {
      const imgBytes = fs.readFileSync(seedImagePath).toString('base64');
      payload.instances[0].image = { bytesBase64Encoded: imgBytes };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Veo API Error (${res.status}): ${errText}`);
    }

    const operation = await res.json();
    return operation; // Returns the long-running operation object
  }
}

module.exports = GoogleAIBridge;
