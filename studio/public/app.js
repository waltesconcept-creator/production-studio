// ============================================================
// GOOGLE FLOW & NANO BANANA 2 AI VIDEO STUDIO CONTROLLER
// ============================================================

let currentProject = null;
let selectedCharRef = null;
let selectedSceneRef = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initDropzones();
  initActionButtons();
  initApiKeyModal();
  loadProject();
});

// ------------------------------------------------------------
// 0. API Key Management
// ------------------------------------------------------------
async function initApiKeyModal() {
  const btn = document.getElementById('apiKeySettingsBtn');
  const modal = document.getElementById('apiKeyModal');
  const saveBtn = document.getElementById('saveApiKeyBtn');
  const input = document.getElementById('apiKeyInput');

  const providerSelect = document.getElementById('providerSelect');

  btn.addEventListener('click', () => {
    modal.style.display = 'flex';
    checkApiKeyStatus();
  });

  if (providerSelect) {
    providerSelect.addEventListener('change', () => {
      const val = providerSelect.value;
      const input = document.getElementById('apiKeyInput');
      if (val === 'gemini') {
        input.placeholder = 'AIzaSy... or AQ.Ab8...';
      } else if (val === 'fal') {
        input.placeholder = 'fal_... (From fal.ai/dashboard/keys)';
      } else if (val === 'replicate') {
        input.placeholder = 'r8_... (From replicate.com/account/api-tokens)';
      }
    });
  }

  saveBtn.addEventListener('click', async () => {
    const val = input.value.trim();
    const provider = providerSelect ? providerSelect.value : 'gemini';
    if (!val) {
      showToast('Please enter a valid API key');
      return;
    }
    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: val, provider })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'API Key configured!');
        input.value = '';
        checkApiKeyStatus();
      } else {
        showToast('Error: ' + data.error);
      }
    } catch (e) {
      showToast('Failed to save API key: ' + e.message);
    }
  });

  checkApiKeyStatus();
}

async function checkApiKeyStatus() {
  try {
    const res = await fetch('/api/settings/api-key');
    const data = await res.json();
    const btnText = document.getElementById('apiKeyBtnText');
    const btn = document.getElementById('apiKeySettingsBtn');
    if (data.isConfigured) {
      btnText.innerText = `Connected (${data.maskedKey})`;
      btn.style.borderColor = 'var(--accent-emerald)';
      btn.style.color = 'var(--accent-emerald)';
    } else {
      btnText.innerText = 'Connect Cloud AI';
      btn.style.borderColor = 'var(--accent-cyan)';
      btn.style.color = 'var(--accent-cyan)';
    }

    // Update modal provider badges if elements exist
    const provs = data.providers;
    if (provs) {
      const gBadge = document.getElementById('provStatusGoogle');
      if (gBadge) {
        gBadge.innerText = provs.google.configured ? `CONNECTED (${provs.google.masked})` : 'NOT CONFIGURED';
        gBadge.className = provs.google.configured ? 'badge badge-success' : 'badge';
      }

      const fBadge = document.getElementById('provStatusFal');
      if (fBadge) {
        fBadge.innerText = provs.fal.configured ? `CONNECTED (${provs.fal.masked})` : 'NOT CONFIGURED';
        fBadge.className = provs.fal.configured ? 'badge badge-success' : 'badge';
        fBadge.style.background = provs.fal.configured ? '' : 'rgba(148, 163, 184, 0.2)';
        fBadge.style.color = provs.fal.configured ? '' : '#94a3b8';
      }

      const rBadge = document.getElementById('provStatusReplicate');
      if (rBadge) {
        rBadge.innerText = provs.replicate.configured ? `CONNECTED (${provs.replicate.masked})` : 'NOT CONFIGURED';
        rBadge.className = provs.replicate.configured ? 'badge badge-success' : 'badge';
        rBadge.style.background = provs.replicate.configured ? '' : 'rgba(148, 163, 184, 0.2)';
        rBadge.style.color = provs.replicate.configured ? '' : '#94a3b8';
      }

      const activeDisp = document.getElementById('activeKeyDisplay');
      if (activeDisp) {
        activeDisp.innerText = provs.google.configured ? `Google: ${provs.google.masked}` : 'None';
      }
    }
  } catch (e) {
    console.warn('API key check note:', e.message);
  }
}

function closeApiKeyModal() {
  document.getElementById('apiKeyModal').style.display = 'none';
}

// ------------------------------------------------------------
// 1. Tab Navigation
// ------------------------------------------------------------
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const tabId = `tab-${tab.getAttribute('data-tab')}`;
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });
}

function switchTab(tabKey) {
  const tabBtn = document.querySelector(`.nav-tab[data-tab="${tabKey}"]`);
  if (tabBtn) tabBtn.click();
}

// ------------------------------------------------------------
// 2. Load & Sync Project State
// ------------------------------------------------------------
async function loadProject() {
  try {
    const res = await fetch('/api/project');
    const data = await res.json();
    if (data.success && data.project) {
      currentProject = data.project;
      populateUI(currentProject);
      showToast('Loaded project: ' + currentProject.story.title);
    }
  } catch (err) {
    console.error('Failed to load project:', err);
    showToast('Notice: initialized new studio project');
  }
}

function populateUI(proj) {
  // Story tab
  if (proj.story) {
    document.getElementById('storyTitle').value = proj.story.title || '';
    document.getElementById('storySynopsis').value = proj.story.synopsis || '';
    document.getElementById('storyGenre').value = proj.story.genre || 'Cinematic Documentary';
    document.getElementById('storyAspect').value = proj.story.aspectRatio || '16:9';
    renderBeats(proj.story.beats || []);
  }

  // Character tab
  if (proj.characters && proj.characters.length > 0) {
    const char = proj.characters[0];
    document.getElementById('charName').value = char.name || '';
    document.getElementById('charRole').value = char.role || '';
    document.getElementById('charTraits').value = char.traits || '';
    document.getElementById('charClothing').value = char.clothing || '';
    if (char.sheetPath) {
      document.getElementById('charSheetImg').src = char.sheetPath;
    }
    if (char.nanoBanana2Prompt) {
      document.getElementById('charPromptText').innerText = char.nanoBanana2Prompt.prompt;
    }
  }

  // Scene tab
  if (proj.scenes && proj.scenes.length > 0) {
    const sc = proj.scenes[0];
    document.getElementById('sceneLocation').value = sc.location || '';
    document.getElementById('sceneTime').value = sc.timeOfDay || '';
    document.getElementById('sceneAtmosphere').value = sc.atmosphere || '';
    document.getElementById('sceneArchitecture').value = sc.architecture || '';
    if (sc.sheetPath) {
      document.getElementById('sceneSheetImg').src = sc.sheetPath;
    }
    if (sc.nanoBanana2Prompt) {
      document.getElementById('scenePromptText').innerText = sc.nanoBanana2Prompt.prompt;
    }
  }

  // Shots tab
  if (proj.shots && proj.shots.length > 0) {
    renderShots(proj.shots);
    renderFootage(proj.shots);
  }
}

// ------------------------------------------------------------
// 3. Dropzones & File Upload
// ------------------------------------------------------------
function initDropzones() {
  setupDropzone('charDropzone', 'charFileInput', (fileData) => {
    handleFileUpload(fileData, 'character');
  });

  setupDropzone('sceneDropzone', 'sceneFileInput', (fileData) => {
    handleFileUpload(fileData, 'scene');
  });
}

function setupDropzone(dropzoneId, inputId, onUploadSuccess) {
  const dropzone = document.getElementById(dropzoneId);
  const input = document.getElementById(inputId);

  dropzone.addEventListener('click', () => input.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#ff5500';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '';
  });

  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '';
    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0], onUploadSuccess);
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      uploadFile(input.files[0], onUploadSuccess);
    }
  });
}

async function uploadFile(file, callback) {
  const formData = new FormData();
  formData.append('file', file);

  showToast(`Uploading ${file.name}...`);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.file) {
      showToast(`Uploaded ${data.file.filename}`);
      callback(data.file);
    } else {
      showToast('Upload error: ' + (data.error || 'Failed'));
    }
  } catch (err) {
    console.error('Upload error:', err);
    showToast('Upload failed: ' + err.message);
  }
}

function handleFileUpload(fileData, department) {
  if (department === 'character') {
    selectedCharRef = fileData.relativeUrl;
    const container = document.getElementById('charFramesContainer');
    
    if (fileData.isVideo && fileData.extractedFrames && fileData.extractedFrames.length > 0) {
      container.style.display = 'grid';
      container.innerHTML = '';
      fileData.extractedFrames.forEach((frame, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `frame-thumbnail ${idx === 0 ? 'selected' : ''}`;
        thumb.innerHTML = `
          <img src="${frame.relativePath}" alt="Frame ${frame.timestamp}s">
          <span class="frame-tag">${frame.timestamp}s</span>
        `;
        thumb.addEventListener('click', () => {
          document.querySelectorAll('#charFramesContainer .frame-thumbnail').forEach(t => t.classList.remove('selected'));
          thumb.classList.add('selected');
          selectedCharRef = frame.relativePath;
          showToast(`Selected ${frame.timestamp}s frame as character anchor`);
        });
        container.appendChild(thumb);
      });
      selectedCharRef = fileData.extractedFrames[0].relativePath;
    } else {
      container.style.display = 'none';
    }
  } else if (department === 'scene') {
    selectedSceneRef = fileData.relativeUrl;
    const container = document.getElementById('sceneFramesContainer');
    if (fileData.isVideo && fileData.extractedFrames && fileData.extractedFrames.length > 0) {
      container.style.display = 'grid';
      container.innerHTML = '';
      fileData.extractedFrames.forEach((frame, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `frame-thumbnail ${idx === 0 ? 'selected' : ''}`;
        thumb.innerHTML = `
          <img src="${frame.relativePath}" alt="Frame ${frame.timestamp}s">
          <span class="frame-tag">${frame.timestamp}s</span>
        `;
        thumb.addEventListener('click', () => {
          document.querySelectorAll('#sceneFramesContainer .frame-thumbnail').forEach(t => t.classList.remove('selected'));
          thumb.classList.add('selected');
          selectedSceneRef = frame.relativePath;
          showToast(`Selected ${frame.timestamp}s frame as scene anchor`);
        });
        container.appendChild(thumb);
      });
      selectedSceneRef = fileData.extractedFrames[0].relativePath;
    } else {
      container.style.display = 'none';
    }
  }
}

// ------------------------------------------------------------
// 4. Action Handlers
// ------------------------------------------------------------
function initActionButtons() {
  // Save Project
  document.getElementById('saveProjectBtn').addEventListener('click', async () => {
    syncFormToState();
    try {
      const res = await fetch('/api/project/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject)
      });
      const data = await res.json();
      if (data.success) showToast('Project saved successfully!');
    } catch (e) {
      showToast('Save failed: ' + e.message);
    }
  });

  // Inspiration Idea Chips (Tap to populate)
  document.querySelectorAll('.idea-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const title = chip.getAttribute('data-title');
      const synopsis = chip.getAttribute('data-synopsis');
      const genre = chip.getAttribute('data-genre');
      if (title) document.getElementById('storyTitle').value = title;
      if (synopsis) document.getElementById('storySynopsis').value = synopsis;
      if (genre) document.getElementById('storyGenre').value = genre;
      showToast(`Loaded idea: ${title}`);
    });
  });

  // Analyze Story into Beats
  document.getElementById('analyzeStoryBtn').addEventListener('click', async () => {
    const title = document.getElementById('storyTitle').value;
    const synopsis = document.getElementById('storySynopsis').value;
    const genre = document.getElementById('storyGenre').value;
    const aspectRatio = document.getElementById('storyAspect').value;

    showToast('Story Brain analyzing narrative arc...');
    try {
      const res = await fetch('/api/story/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, synopsis, genre, aspectRatio })
      });
      const data = await res.json();
      if (data.success && data.story) {
        currentProject.story = data.story;
        renderBeats(data.story.beats);
        showToast('Generated ' + data.story.beats.length + ' narrative beats!');
      }
    } catch (err) {
      showToast('Analysis error: ' + err.message);
    }
  });

  // Helper: Asynchronous Cloud Job Polling
  async function pollJob(jobId, onProgress, onComplete, onError, intervalMs = 2000, maxAttempts = 120) {
    let attempts = 0;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.success || !data.job) throw new Error('Job not found');

        const job = data.job;
        if (job.status === 'completed') {
          onComplete(job.result);
        } else if (job.status === 'failed') {
          onError(job.error || 'Generation failed');
        } else {
          onProgress(job.stage || 'Processing...', job.progress || 0);
          if (attempts < maxAttempts) {
            setTimeout(poll, intervalMs);
          } else {
            onError('Generation timed out. Check your cloud provider status.');
          }
        }
      } catch (err) {
        onError(err.message);
      }
    };
    poll();
  }

  // Generate Character Sheet (Enterprise Async Queue)
  document.getElementById('generateCharSheetBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateCharSheetBtn');
    const originalText = btn.innerHTML;
    const name = document.getElementById('charName').value || 'Subject';
    const role = document.getElementById('charRole').value || 'Protagonist';
    const traits = document.getElementById('charTraits').value || '';
    const clothing = document.getElementById('charClothing').value || '';
    const refImage = selectedCharRef || currentProject.characters[0]?.refImage;

    btn.disabled = true;
    btn.innerHTML = `⏳ Dispatching to Cloud GPU...`;
    showToast('Submitting character turnaround request to cloud queue...');

    try {
      const res = await fetch('/api/jobs/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, traits, clothing, refImage })
      });
      const data = await res.json();
      if (data.success && data.jobId) {
        pollJob(
          data.jobId,
          (stage, progress) => {
            btn.innerHTML = `⚡ ${stage} (${progress}%)`;
          },
          (result) => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            if (result && result.character) {
              document.getElementById('charSheetImg').src = `${result.character.sheetPath}?t=${Date.now()}`;
              if (result.character.nanoBanana2Prompt) {
                document.getElementById('charPromptText').innerText = result.character.nanoBanana2Prompt.prompt;
              }
              currentProject.characters[0] = result.character;
              showToast('✅ Character turnaround sheet generated & identity locked!');
            }
          },
          (err) => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            showToast('⚠️ Character generation note: ' + err, 10000);
            console.warn('Character generation failed:', err);
          }
        );
      } else {
        btn.disabled = false;
        btn.innerHTML = originalText;
        showToast('Submission error: ' + (data.error || 'Failed to start job'));
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      showToast('Character generation error: ' + err.message);
    }
  });

  // Generate Scene Sheet (Enterprise Async Queue)
  document.getElementById('generateSceneSheetBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateSceneSheetBtn');
    const originalText = btn.innerHTML;
    const location = document.getElementById('sceneLocation').value || 'Location';
    const timeOfDay = document.getElementById('sceneTime').value || 'Dusk';
    const atmosphere = document.getElementById('sceneAtmosphere').value || '';
    const architecture = document.getElementById('sceneArchitecture').value || '';
    const refImage = selectedSceneRef || currentProject.scenes[0]?.refImage;

    btn.disabled = true;
    btn.innerHTML = `⏳ Dispatching to Cloud GPU...`;
    showToast('Submitting scene environment request to cloud queue...');

    try {
      const res = await fetch('/api/jobs/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, timeOfDay, atmosphere, architecture, refImage })
      });
      const data = await res.json();
      if (data.success && data.jobId) {
        pollJob(
          data.jobId,
          (stage, progress) => {
            btn.innerHTML = `⚡ ${stage} (${progress}%)`;
          },
          (result) => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            if (result && result.scene) {
              document.getElementById('sceneSheetImg').src = `${result.scene.sheetPath}?t=${Date.now()}`;
              if (result.scene.nanoBanana2Prompt) {
                document.getElementById('scenePromptText').innerText = result.scene.nanoBanana2Prompt.prompt;
              }
              currentProject.scenes[0] = result.scene;
              showToast('✅ Scene environment sheet generated & lighting locked!');
            }
          },
          (err) => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            showToast('⚠️ Scene generation note: ' + err, 10000);
            console.warn('Scene generation failed:', err);
          }
        );
      } else {
        btn.disabled = false;
        btn.innerHTML = originalText;
        showToast('Submission error: ' + (data.error || 'Failed to start job'));
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      showToast('Scene generation error: ' + err.message);
    }
  });

  // Genre change listener: auto-suggest templates
  document.getElementById('storyGenre').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val.includes('Narrative') || val.includes('Storm')) {
      document.getElementById('storyTitle').value = 'THE IMPERVIOUS // CRAFT VS. THE CATACLYSM';
      document.getElementById('storySynopsis').value = 'Inside a dark, tactile industrial workshop, a master craftsman spends months engineering an impenetrable waterproof storm jacket, inspecting sealed micro-seams under a warm amber lamp and testing water tension. He zips the finished jacket onto a protagonist, who steps out into an apocalyptic Category-5 hurricane. Amid howling winds, bending trees, and torrential driving rain, downpours strike the jacket and instantly shatter and bead off like liquid glass. The protagonist smiles with calm invincibility and breaks into an effortless run through the flooded streets, completely dry and untamed.';
      document.getElementById('charName').value = 'Arlo Vance';
      document.getElementById('charRole').value = 'The Impervious Subject';
      document.getElementById('charTraits').value = 'Calm focused gaze, rugged cinematic features, natural skin pores, serene posture under disaster conditions';
      document.getElementById('charClothing').value = 'Matte obsidian waterproof storm jacket with taped weather-sealed zippers, high storm collar, tactile textured membrane';
      document.getElementById('sceneLocation').value = 'Industrial Design Atelier & Torrential Storm City';
      document.getElementById('sceneTime').value = 'Warm 2800K Workshop Lamp vs. Midnight Tempest Downpour';
      document.getElementById('sceneAtmosphere').value = 'Sideways driving rain, atmospheric storm haze, flying debris, water beading on fabric in 1000fps macro, wet asphalt reflections';
      document.getElementById('sceneArchitecture').value = 'Heavy oak drafting tables and blueprint rolls inside; brutalist flooded urban avenue outside';
      showToast('Loaded Cinematic Narrative Brand Film template (Craft vs. Storm)!');
    } else if (val.includes('Nike') || val.includes('Athletic')) {
      document.getElementById('storyTitle').value = 'UNSTOPPABLE // THE 5:00 AM MANIFESTO';
      document.getElementById('storySynopsis').value = 'At 5:00 AM in the freezing rain, an underdog athlete laces up on an empty track. Every muscle screams to quit. But when the gun fires, the world blurs into 1000fps supersonic focus. He leaves doubt in the dust and claims greatness.';
      document.getElementById('charName').value = 'Marcus Ray';
      document.getElementById('charRole').value = 'Championship Sprinter';
      document.getElementById('charTraits').value = 'Chiseled muscular conditioning, visible sweat sheen, fierce locked-in gaze, intense breathing';
      document.getElementById('charClothing').value = 'Matte black aerodynamic compression gear, carbon running spikes with electric orange accents';
      document.getElementById('sceneLocation').value = 'Rain-Soaked Olympic Track';
      document.getElementById('sceneTime').value = 'Pre-Dawn 5:00 AM';
      document.getElementById('sceneAtmosphere').value = 'Driving rain, atmospheric steam rising from wet asphalt, blinding 10,000-watt stadium floodlights';
      document.getElementById('sceneArchitecture').value = 'Brutalist concrete stadium tunnel leading onto wet rubber track';
      showToast('Loaded High-Intensity Athletic Anthem template!');
    }
  });

  // Generate Shot List
  document.getElementById('generateShotListBtn').addEventListener('click', async () => {
    syncFormToState();
    showToast('Directing shot list & generating Google Flow prompts...');

    try {
      const res = await fetch('/api/director/shotlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beats: currentProject.story.beats || [],
          characters: currentProject.characters || [],
          scenes: currentProject.scenes || [],
          genre: currentProject.story.genre || ''
        })
      });
      const data = await res.json();
      if (data.success && data.shots) {
        currentProject.shots = data.shots;
        renderShots(data.shots);
        renderFootage(data.shots);
        showToast(`Cinematographer created ${data.shots.length} shots with Google Flow prompts!`);
      }
    } catch (err) {
      showToast('Shot list generation error: ' + err.message);
    }
  });

  // Export Flow Prompts
  document.getElementById('exportFlowPromptsBtn').addEventListener('click', () => {
    if (!currentProject.shots || currentProject.shots.length === 0) {
      showToast('Please generate shot list first.');
      return;
    }
    const flowQueue = currentProject.shots.map(s => ({
      shotCode: s.code,
      scene: s.sceneTitle,
      prompt: s.googleFlowPrompt,
      framing: s.framing,
      lens: s.lens,
      durationSec: s.suggestedDurationSec
    }));

    const blob = new Blob([JSON.stringify(flowQueue, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google_flow_queue_${currentProject.story.title.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    showToast('Exported Google Flow Queue JSON!');
  });

  // Assemble Timeline & Audio
  document.getElementById('assembleTimelineBtn').addEventListener('click', async () => {
    syncFormToState();
    const voicePreset = document.getElementById('voicePresetSelect').value;
    showToast('Synthesizing neural voiceover & assembling Remotion timeline...');

    try {
      const res = await fetch('/api/production/assemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: currentProject, voicePreset })
      });
      const data = await res.json();
      if (data.success) {
        const audio = document.getElementById('voiceAudioPlayer');
        audio.src = `${data.voiceoverUrl}?t=${Date.now()}`;
        audio.load();
        showToast('Timeline & Voiceover ready! Duration: ' + Math.round(data.totalDurationFrames / 30) + 's');
      }
    } catch (err) {
      showToast('Assembly error: ' + err.message);
    }
  });

  // Render Final Master Video
  document.getElementById('renderMasterBtn').addEventListener('click', async () => {
    showToast('Remotion engine compiling 1080p Master MP4...');
    document.getElementById('renderStatusBadge').innerText = 'Rendering...';
    document.getElementById('renderStatusBadge').className = 'badge badge-cyan';

    try {
      const res = await fetch('/api/production/render', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        const vid = document.getElementById('masterVideoPlayer');
        vid.src = `${data.videoUrl}?t=${Date.now()}`;
        vid.load();
        document.getElementById('renderStatusBadge').innerText = 'Render Complete';
        document.getElementById('renderStatusBadge').className = 'badge badge-success';
        document.getElementById('renderSuccessBox').style.display = 'block';
        showToast('Master Video rendered successfully!');
      } else {
        showToast('Render error: ' + (data.error || 'Failed'));
      }
    } catch (err) {
      showToast('Render failed: ' + err.message);
    }
  });

  // Quick Assemble Button in Header
  document.getElementById('quickAssembleBtn').addEventListener('click', () => {
    switchTab('assembly');
    document.getElementById('assembleTimelineBtn').click();
  });
}

function syncFormToState() {
  if (!currentProject) return;
  currentProject.story.title = document.getElementById('storyTitle').value;
  currentProject.story.synopsis = document.getElementById('storySynopsis').value;
  currentProject.story.genre = document.getElementById('storyGenre').value;
  currentProject.story.aspectRatio = document.getElementById('storyAspect').value;
}

// ------------------------------------------------------------
// 5. Dynamic Rendering Helpers & Live In-Flight Editing
// ------------------------------------------------------------
function renderBeats(beats) {
  const container = document.getElementById('beatsContainer');
  container.innerHTML = '';
  document.getElementById('beatsCountBadge').innerText = `${beats.length} Scenes`;

  beats.forEach((b, i) => {
    const card = document.createElement('div');
    card.className = 'beat-card';
    card.innerHTML = `
      <div class="beat-card-header">
        <span class="badge badge-accent">SCENE ${String(i + 1).padStart(2, '0')}</span>
        <input type="text" class="beat-edit-title" value="${escapeQuotes(b.title || `Scene ${i + 1}`)}" onchange="updateBeatTitle(${i}, this.value)" placeholder="Scene title...">
        <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
          <input type="number" class="beat-edit-duration" value="${b.durationSec || 4}" min="1" max="60" style="width: 48px; padding: 4px; text-align: center;" onchange="updateBeatDuration(${i}, this.value)">
          <span style="font-size: 11px; color: var(--accent-cyan); font-family: var(--font-code);">s</span>
          <button class="btn btn-xs btn-outline" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4); min-width: 28px;" onclick="deleteBeat(${i})" title="Delete scene">✕</button>
        </div>
      </div>
      <div style="margin-top: 4px;">
        <label style="font-size: 11px; color: var(--text-sub); font-weight: 600; display: block; margin-bottom: 4px;">Action / Narration Dialogue:</label>
        <textarea class="beat-edit-narration" rows="2" onchange="updateBeatNarration(${i}, this.value)" placeholder="Visual action or voiceover for this beat...">${b.narration || b.description || ''}</textarea>
      </div>
    `;
    container.appendChild(card);
  });

  // Add Scene button
  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-outline btn-block';
  addBtn.style.marginTop = '10px';
  addBtn.innerHTML = '+ Add Another Scene';
  addBtn.onclick = addNewBeat;
  container.appendChild(addBtn);
}

function updateBeatTitle(index, val) {
  if (currentProject.story.beats[index]) {
    currentProject.story.beats[index].title = val;
    showToast(`Scene ${index + 1} title updated!`);
  }
}

function updateBeatDuration(index, val) {
  if (currentProject.story.beats[index]) {
    currentProject.story.beats[index].durationSec = parseInt(val) || 4;
    showToast(`Scene ${index + 1} duration set to ${val}s`);
  }
}

function updateBeatNarration(index, val) {
  if (currentProject.story.beats[index]) {
    currentProject.story.beats[index].narration = val;
    currentProject.story.beats[index].description = val;
    showToast(`Scene ${index + 1} script updated!`);
  }
}

function addNewBeat() {
  const newIdx = currentProject.story.beats.length + 1;
  currentProject.story.beats.push({
    id: `beat-${Date.now()}`,
    title: `Scene 0${newIdx} // New Sequence`,
    description: 'Describe the action, camera movement, or dialogue here...',
    narration: 'Narration or voiceover line for this scene.',
    durationSec: 4
  });
  renderBeats(currentProject.story.beats);
  showToast(`Added Scene ${newIdx}`);
}

function deleteBeat(index) {
  if (currentProject.story.beats.length <= 1) {
    showToast('Must keep at least 1 scene');
    return;
  }
  currentProject.story.beats.splice(index, 1);
  renderBeats(currentProject.story.beats);
  showToast('Scene removed');
}

function renderShots(shots) {
  const container = document.getElementById('shotsContainer');
  container.innerHTML = '';

  shots.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'shot-card';
    
    const crew = s.crew || {};
    const vfx = crew.vfxAndPhysics || { collisionIntegrity: 'SOLID COLLISION LOCK', phasingShield: 'Zero noclip / table phasing' };
    const dp = crew.cinematographer || { lens: s.lens, opticalBokeh: 'Anamorphic f/1.8' };
    const gaffer = crew.gafferAndLighting || { skinRendering: 'Subsurface Scattering (SSS) + Natural Pores' };
    const cont = crew.continuityLead || { eyelineRule: '180-Degree Axis Maintained' };

    card.innerHTML = `
      <div class="shot-card-header">
        <span class="shot-code">${s.code} // ${s.sceneTitle}</span>
        <span class="shot-badge">${s.framing}</span>
      </div>
      <div class="shot-meta">
        <span>Cast: ${s.character}</span> &bull; 
        <span>Set: ${s.environment}</span> &bull; 
        <span>${s.suggestedDurationSec}s</span>
      </div>
      
      <!-- Virtual Production Crew Guardrails (Collapsible) -->
      <details class="crew-guardrails" style="cursor: pointer;">
        <summary class="crew-guardrails-title" style="list-style: none; display: flex; justify-content: space-between; align-items: center; user-select: none;">
          <span>Production Crew Guardrails</span>
          <span class="badge badge-success">ACTIVE ▼</span>
        </summary>
        <div style="margin-top: 8px;">
          <div class="crew-item">
            <span class="crew-item-label">VFX & PHYSICS:</span>
            <span class="crew-item-val highlight">${vfx.phasingShield || 'Solid objects rigid, zero noclip or furniture phasing'}</span>
          </div>
          <div class="crew-item">
            <span class="crew-item-label">LIGHT & SKIN:</span>
            <span class="crew-item-val">${gaffer.skinRendering} &bull; ${gaffer.colorTemperature || '3200K'}</span>
          </div>
          <div class="crew-item">
            <span class="crew-item-label">CINEMATOGRAPHER:</span>
            <span class="crew-item-val">${dp.lens} on ${dp.rig || 'Mechanical Rig'}</span>
          </div>
          <div class="crew-item">
            <span class="crew-item-label">CONTINUITY:</span>
            <span class="crew-item-val">${cont.eyelineRule} &bull; ${cont.spatialTopology || 'Geometry Locked'}</span>
          </div>
        </div>
      </details>

      <div class="flow-prompt-box">
        <div class="flow-prompt-label">
          <span>GOOGLE FLOW / VEO PROMPT</span>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-xs btn-outline" onclick="saveShotPrompt(${idx})">Save</button>
            <button class="btn btn-xs" onclick="copyText(document.getElementById('prompt-text-${idx}').value)">Copy</button>
          </div>
        </div>
        <textarea id="prompt-text-${idx}" class="flow-prompt-text" rows="4" style="width: 100%; background: transparent; border: none; color: #e2e8f0; resize: vertical;">${s.googleFlowPrompt}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function saveShotPrompt(idx) {
  const textarea = document.getElementById(`prompt-text-${idx}`);
  if (textarea && currentProject.shots[idx]) {
    currentProject.shots[idx].googleFlowPrompt = textarea.value;
    showToast(`Shot ${currentProject.shots[idx].code} prompt updated!`);
  }
}

function renderFootage(shots) {
  const grid = document.getElementById('footageGrid');
  grid.innerHTML = '';

  shots.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'footage-card';
    const hasVideo = !!s.videoClipUrl;

    if (hasVideo) {
      card.innerHTML = `
        <div class="shot-card-header">
          <span class="shot-code">${s.code}</span>
          <span class="shot-badge">${s.framing}</span>
        </div>
        <div class="footage-video-container">
          <video controls playsinline preload="metadata">
            <source src="${s.videoClipUrl}" type="video/mp4">
          </video>
        </div>
        <div class="footage-actions">
          <a href="${s.videoClipUrl}" download="${s.code}_clip.mp4" class="btn btn-outline btn-xs">
            Download Bit (.mp4)
          </a>
          <button id="gen-video-btn-${idx}" class="btn btn-outline btn-xs" onclick="triggerAIVideoGeneration('${s.id}', ${idx})">
            Regenerate Video
          </button>
          <label class="btn btn-outline btn-xs" style="cursor: pointer;">
            Replace MP4
            <input type="file" accept="video/mp4" style="display: none;" onchange="uploadReplacementVideo('${s.id}', this.files[0])">
          </label>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="shot-card-header">
          <span class="shot-code">${s.code}</span>
          <span class="badge badge-accent">PENDING FOOTAGE</span>
        </div>
        <div class="footage-video-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; background: #080a10; border: 1px dashed #202636; padding: 15px; text-align: center;">
          <div style="font-size: 13px; font-weight: 600; color: #f1f5f9;">Awaiting Video Render</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Run cloud video model or upload an MP4 clip</div>
        </div>
        <div class="footage-actions" style="display: flex; flex-direction: column; gap: 6px;">
          <button id="gen-video-btn-${idx}" class="btn btn-primary btn-xs" onclick="triggerAIVideoGeneration('${s.id}', ${idx})">
            Generate Cloud Video
          </button>
          <label class="btn btn-outline btn-xs" style="cursor: pointer; width: 100%; text-align: center;">
            Upload .MP4 Clip
            <input type="file" accept="video/mp4" style="display: none;" onchange="uploadReplacementVideo('${s.id}', this.files[0])">
          </label>
        </div>
      `;
    }
    grid.appendChild(card);
  });
}

async function triggerAIVideoGeneration(shotId, shotIndex) {
  const shot = currentProject.shots[shotIndex];
  if (!shot) return;

  const btn = document.getElementById(`gen-video-btn-${shotIndex}`);
  const originalText = btn ? btn.innerHTML : 'Generate';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `⏳ Dispatching Video Job...`;
  }
  showToast(`Submitting Shot ${shot.code} to Cloud Video Diffusion...`);

  try {
    const res = await fetch(`/api/jobs/generate-video/${shotId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: shot.googleFlowPrompt,
        seedImagePath: shot.characterSheetRef || shot.sceneSheetRef || null,
        durationSec: shot.suggestedDurationSec || 5
      })
    });
    const data = await res.json();
    if (data.success && data.jobId) {
      pollJob(
        data.jobId,
        (stage, progress) => {
          if (btn) btn.innerHTML = `⚡ ${stage} (${progress}%)`;
        },
        (result) => {
          showToast(`✅ Video for Shot ${shot.code} rendered successfully!`);
          loadProject();
        },
        (err) => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
          showToast(`⚠️ Video generation note: ${err}`, 10000);
        },
        3000,
        180
      );
    } else {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
      showToast('Error: ' + (data.error || 'Failed to submit video job'));
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
    showToast('Video generation error: ' + err.message);
  }
}

function copyText(str) {
  navigator.clipboard.writeText(str);
  showToast('Copied Google Flow prompt to clipboard!');
}

function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function uploadReplacementVideo(shotId, file) {
  if (!file) return;
  const formData = new FormData();
  formData.append('video', file);

  showToast(`Replacing footage for ${shotId}...`);
  try {
    const res = await fetch(`/api/footage/upload/${shotId}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Shot ${shotId} video updated!`);
      loadProject();
    }
  } catch (err) {
    showToast('Failed to update footage: ' + err.message);
  }
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}
