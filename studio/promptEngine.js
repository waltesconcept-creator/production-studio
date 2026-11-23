/**
 * Prompt & Cinematic Engine for Google Nano Banana 2 & Google Flow / Veo
 * Enhanced with the Virtual Hollywood Production Crew:
 * - Director: Blocking, emotional intent, pacing
 * - Cinematographer (DP): Optical fidelity, prime lenses, true depth of field, mechanical rigs
 * - Gaffer & Lighting Lead: Subsurface scattering (SSS), Kelvin temperatures, skin tone fidelity
 * - VFX & Physics Supervisor: Solid collision boundaries, zero noclip/phasing, weight transfer
 * - Continuity Supervisor: 180-degree rule, spatial room topology, eyeline continuity
 */

class PromptEngine {
  /**
   * Master Negative Prompt Arrays categorized by production discipline
   */
  static NEGATIVE_PROMPTS = {
    skinAndAnatomy: [
      'plastic skin', 'wax figure', 'airbrushed', 'porcelain skin', 'smoothed pores',
      'doll face', 'CGI render', '3D video game', 'uncanny valley', 'deformed iris',
      'crossed eyes', 'asymmetrical pupil', 'extra fingers', 'fused digits',
      'missing knuckle', 'rubber skin', 'excessive beauty filter'
    ],
    physicsAndCollision: [
      'noclip', 'phasing through furniture', 'walking through tables', 'walking through chairs',
      'feet sliding on ground', 'moonwalking', 'floating above floor', 'body intersecting solid objects',
      'door swinging through wall', 'impossible door opening', 'morphing background', 'liquid walls',
      'melting geometry', 'disappearing objects', 'teleporting props', 'weightless movement'
    ],
    cameraAndArtifacts: [
      'jitter', 'temporal flickering', 'motion smear', 'unnatural morph cut',
      'over-sharpened edge halos', 'cartoon outlines', 'compression artifacts',
      'low frame rate stutter', 'amateur handheld wobble', 'distorted perspective'
    ]
  };

  static getMasterNegativePrompt() {
    return [
      ...PromptEngine.NEGATIVE_PROMPTS.skinAndAnatomy,
      ...PromptEngine.NEGATIVE_PROMPTS.physicsAndCollision,
      ...PromptEngine.NEGATIVE_PROMPTS.cameraAndArtifacts
    ].join(', ');
  }

  /**
   * Nano Banana 2 Character Turnaround Sheet Prompt
   */
  static buildCharacterSheetPrompt(character, genre = '') {
    const { name, role, traits, clothing, referenceDesc } = character;
    const isBrandFilm = /narrative|brand|commercial|craft|storm|jacket|movie/i.test(genre || role || clothing || '');

    const skinDirective = [
      `Skin Texture & Micro-Detail Directive: Ultra-photorealistic epidermal micro-texture with visible natural skin pores,`,
      `fine vellus facial peach-fuzz, authentic micro-creases at eye corners, realistic subsurface scattering (SSS) allowing natural warm light transmission through skin.`,
      `Zero airbrushing, zero plastic doll smoothing, zero CGI gloss. Realistic skin tone variation with authentic blood micro-circulation flush under cheeks and lips.`
    ].join(' ');

    if (isBrandFilm) {
      return {
        title: `${name} - Cinematic Narrative Character Model Sheet`,
        model: 'Google Nano Banana 2 (Gemini 3.1 Flash Image)',
        type: 'cinematic_narrative_turnaround',
        prompt: [
          `Master character design sheet for ${name}, ${role || 'Protagonist / Artisan'}.`,
          skinDirective,
          `Features & Expression: ${traits || 'Grounded, authentic facial structure, focused calm eyes, natural skin complexion under cinematic low-key lighting'}.`,
          `Costume & Tactile Fabric: ${clothing || 'Engineered matte obsidian waterproof storm jacket with taped seams, high storm collar, tactile textured technical weave, natural fabric weight and draping'}.`,
          referenceDesc ? `Reference Identity: ${referenceDesc}.` : '',
          `Layout: Clean 4-view cinematic model sheet on a single studio canvas:`,
          `1) Full-body Front View in natural grounded posture, 2) 3/4 Profile, 3) Side Silhouette, 4) Macro facial focus and technical fabric seam detail.`,
          `Visual Style: Fincher & Villeneuve dark cinematic style, Arri Alexa 65 with 50mm Master Prime, deep obsidian blacks, warm amber rim separation, photorealistic 8K.`,
          `Constraint: Identical facial bone structure, pores, skin tones, and jacket construction strictly locked across all panels.`
        ].filter(Boolean).join(' '),
        negativePrompt: PromptEngine.getMasterNegativePrompt(),
        aspectRatio: '16:9',
        parameters: {
          lighting: 'Low-key atmospheric tungsten key (3000K) + deep charcoal shadows',
          lens: '50mm prime f/2.0',
          consistencyWeight: 0.98,
          subsurfaceScattering: 0.85
        }
      };
    }

    return {
      title: `${name} - Character Consistency Sheet`,
      model: 'Google Nano Banana 2 (Gemini 3.1 Flash Image)',
      type: 'character_turnaround_sheet',
      prompt: [
        `Master character design turnaround sheet for ${name}, ${role}.`,
        skinDirective,
        `Facial Structure: ${traits || 'Distinctive natural facial bone structure, photorealistic eye reflections, natural skin complexion'}.`,
        `Costume & Wardrobe: ${clothing || 'Tailored cinematic wardrobe with tactile fabric weave, natural fold draping, and realistic seams'}.`,
        referenceDesc ? `Reference Identity: ${referenceDesc}.` : '',
        `Layout: Clean professional multi-view model sheet displaying 4 angles on a single canvas:`,
        `1) Full-body Front View, 2) 3/4 Turn View, 3) Side Profile, 4) Macro skin & expression matrix (neutral, intense focus, subtle reaction).`,
        `Visual Style: Photographed on Arri Alexa 65 with 50mm Zeiss Master Prime, authentic 35mm Kodak film grain, neutral 3200K tungsten studio fill with soft rim separation.`,
        `Constraint: Strictly preserve identical facial proportions, exact bone structure, skin complexion, and wardrobe details across all 4 angles.`
      ].filter(Boolean).join(' '),
      negativePrompt: PromptEngine.getMasterNegativePrompt(),
      aspectRatio: '16:9',
      parameters: {
        lighting: 'Neutral 3-point cinematic studio lighting with SSS fill',
        lens: '50mm prime f/2.8',
        consistencyWeight: 0.98,
        subsurfaceScattering: 0.82
      }
    };
  }

  /**
   * Nano Banana 2 Scene & Environment Sheet Prompt
   */
  static buildSceneSheetPrompt(scene, genre = '') {
    const { location, timeOfDay, atmosphere, architecturalStyle, colorPalette } = scene;
    const isBrandFilm = /narrative|brand|commercial|craft|storm|jacket|movie/i.test(genre || location || atmosphere || '');

    const spatialDirective = [
      `Spatial Physics & Architectural Topology: Exact structural floor plan geometry, rigid solid object placement,`,
      `clearly defined door clearance zones, distinct furniture collision boundaries, fixed window light ingress vectors.`,
      `Every solid surface (concrete, polished hardwood, metal, glass, wet asphalt) exhibits true optical specularity, physical roughness map, and zero spatial morphing.`
    ].join(' ');

    if (isBrandFilm) {
      return {
        title: `${location} - Narrative Brand Film Environment Sheet`,
        model: 'Google Nano Banana 2 (Gemini 3.1 Flash Image)',
        type: 'narrative_brand_environment',
        prompt: [
          `Cinematic commercial environment production sheet for ${location}.`,
          spatialDirective,
          `Time & Atmosphere: ${timeOfDay || 'Pre-dawn storm deluge & warm workshop amber'}, ${atmosphere || 'torrential driving rain, hurricane-level mist, moisture beading on surfaces, contrast between warm atelier interior and apocalyptic storm outside'}.`,
          `Architecture & Materials: ${architecturalStyle || 'Industrial craftsman design workshop with heavy oak drafting tables leading out into flooded concrete urban streets'}.`,
          `Color Palette: ${colorPalette || 'Deep obsidian slate, warm 2800K filament amber, cold cyan wet asphalt reflections'}.`,
          `Layout: 3-panel narrative film guide:`,
          `1) Master establishing shot of workshop interior with rain hammering high factory windows, 2) Torrential outdoor street with deep water reflections and whipping wind, 3) Macro water-beading material swatches.`,
          `Visual Style: 35mm anamorphic cinema, deep shadow detail, Panavision C-Series, true optical rain reflections, zero flat lighting.`
        ].join(' '),
        negativePrompt: PromptEngine.getMasterNegativePrompt(),
        aspectRatio: '16:9',
        parameters: {
          camera: '35mm anamorphic wide',
          lighting: 'Warm tungsten interior vs cold wet exterior storm',
          depth: 'High-contrast volumetric depth'
        }
      };
    }

    return {
      title: `${location} - Environment Production Sheet`,
      model: 'Google Nano Banana 2 (Gemini 3.1 Flash Image)',
      type: 'environment_scene_sheet',
      prompt: [
        `Cinematic production environment concept sheet for ${location}.`,
        spatialDirective,
        `Time & Atmosphere: ${timeOfDay || 'Golden hour dusk'}, ${atmosphere || 'volumetric atmospheric haze, moody cinematic depth'}.`,
        `Architecture & Setting: ${architecturalStyle || 'Modern architectural aesthetic with tactile materials and textured surfaces'}.`,
        `Color Palette: ${colorPalette || 'Deep contrast, warm amber key light, cool cyan shadows'}.`,
        `Layout: 3-panel production guide on a single canvas:`,
        `1) Wide establishing master shot, 2) Medium eye-level angle revealing spatial depth and interior/exterior layout, 3) Lighting and material detail swatches.`,
        `Visual Style: Arri Alexa 65 cinematography, Panavision C-Series anamorphic lens, authentic Kodak Vision3 500T film grain, subtle horizontal lens flare.`
      ].join(' '),
      negativePrompt: PromptEngine.getMasterNegativePrompt(),
      aspectRatio: '16:9',
      parameters: {
        camera: 'Wide anamorphic 35mm',
        lighting: timeOfDay || 'Cinematic dramatic lighting',
        depth: 'Deep volumetric perspective'
      }
    };
  }

  /**
   * Generates shot-by-shot Google Flow / Veo Prompts
   */
  static generateGoogleFlowPrompts(storyBeats, characters = [], scenes = [], genre = '') {
    const isBrandFilm = /narrative|brand|commercial|craft|storm|jacket|movie/i.test(genre || '');
    const shotList = [];

    // Narrative Brand Film Camera Sequence (The Craft vs. The Cataclysm)
    const brandFilmMoves = [
      {
        type: 'Macro Workbench Slider Push-In',
        flag: '--camera-move macro-push --speed slow --fps 60',
        lens: 'Zeiss 100mm Macro Master Prime, f/2.0',
        rig: 'Precision mechanical slider on solid oak workbench',
        physicsConstraint: 'Hands interact firmly with tactile technical fabric and seam roller; zero clipping into the wooden table; physical tools possess authentic mass; single water droplet tested on jacket membrane beads into a perfect sphere with realistic surface tension'
      },
      {
        type: 'Medium Grounded Tracking Push',
        flag: '--camera-move grounded-dolly --speed medium',
        lens: 'Cooke 35mm Anamorphic, eye level',
        rig: 'Chapman Peewee Dolly gliding across workshop floor',
        physicsConstraint: 'Designer walks around drafting table with natural clearance; zips up the technical storm jacket on protagonist with authentic metal teeth engagement; protagonist steps toward solid industrial door, turns physical brass handle downward, door swings open naturally on steel hinges'
      },
      {
        type: 'Low-Angle Cataclysmic Dolly Forward',
        flag: '--camera-move low-angle-forward --speed slow --fps 120-slowmo',
        lens: 'Panavision 24mm Anamorphic, low angle',
        rig: 'Rain-sealed Steadicam pushing forward into the tempest',
        physicsConstraint: 'Category-5 driving rain crashes against protagonist; water droplets strike waterproof jacket fabric and instantly shatter into microscopic beads that roll off; wind bends trees in background without affecting solid ground; protagonist stands completely grounded with firm footing, completely dry inside'
      },
      {
        type: 'Dynamic Pursuit Tracking Shot',
        flag: '--camera-move tracking-run --speed fast --fps 120-slowmo',
        lens: '35mm Wide Anamorphic, tracking alongside runner',
        rig: 'Electric chase vehicle with gimbal stabilizer',
        physicsConstraint: 'Protagonist breaks into a confident, effortless jog/run through flooded asphalt streets; shoes strike puddles displacing water with authentic fluid dynamics; wind whips jacket hood but jacket membrane remains completely impervious; protagonist looks ahead with calm invincible serenity'
      }
    ];

    const defaultCameraMoves = [
      {
        type: 'Grounded Dolly Push-In',
        flag: '--camera-move dolly-in --speed slow',
        lens: '50mm Prime f/1.8',
        rig: 'Chapman Peewee Dolly on polished floor tracks',
        physicsConstraint: 'Subject navigates around desk with natural clearance; zero clipping through chairs or obstacles; physical weight on every footstep'
      },
      {
        type: 'Low-Angle Tracking Push',
        flag: '--camera-move low-angle-tracking --speed medium',
        lens: '35mm Wide Prime f/2.8',
        rig: 'Steadicam operator tracking alongside subject',
        physicsConstraint: 'Solid floor interaction with authentic heel-to-toe stride; doorway clearance respected with realistic door handle rotation'
      },
      {
        type: 'Cinematic Orbit Pan',
        flag: '--camera-move orbit-right-30deg --speed slow',
        lens: '85mm Portrait Prime f/1.4',
        rig: 'Jib arm smooth circular tracking arc',
        physicsConstraint: 'Parallax movement between foreground furniture and background walls preserves rigid 3D spatial geometry'
      },
      {
        type: 'Macro Eye / Texture Push',
        flag: '--camera-move macro-push --speed dynamic',
        lens: '100mm Macro Anamorphic',
        rig: 'Damped macro slider',
        physicsConstraint: 'High epidermal fidelity, visible natural pores, accurate light falloff through skin layers'
      }
    ];

    const movesPool = isBrandFilm ? brandFilmMoves : defaultCameraMoves;

    storyBeats.forEach((beat, index) => {
      const shotNum = index + 1;
      const character = characters[index % characters.length] || { name: 'The Protagonist', clothing: 'Matte obsidian waterproof storm jacket' };
      const scene = scenes[index % scenes.length] || { location: 'Industrial Design Atelier & Torrential Storm', lighting: 'Moody amber workbench vs cold tempest rain' };
      const cameraSpec = movesPool[index % movesPool.length];

      // Physical interaction enforcement
      const physicsGuardrail = [
        `Physical & Spatial Constraints: ${cameraSpec.physicsConstraint}.`,
        `Solid objects (doors, desks, chairs, floors) are completely rigid with zero noclip or phasing.`,
        `Character movement respects gravity, natural mass, and realistic joint biomechanics.`
      ].join(' ');

      // Photoreal skin fidelity directive
      const photorealFidelity = [
        `Visual & Texture Fidelity: Raw uncompressed cinema camera capture, true subsurface scattering (SSS) on human skin,`,
        `visible skin pores, natural dermal imperfections, fine vellus facial hairs, and authentic specular light sheen on wet surfaces.`,
        `Zero artificial smoothing, zero plastic appearance, completely indistinguishable from 35mm film cinema.`
      ].join(' ');

      let flowPrompt = '';
      if (isBrandFilm) {
        flowPrompt = [
          `Cinematic movie commercial: ${beat.action || beat.description}.`,
          `Subject: ${character.name}, wearing ${character.clothing || 'matte obsidian waterproof storm jacket'}, matching character turnaround sheet.`,
          `Environment: ${scene.location}, ${scene.lighting || 'dark atmospheric chiaroscuro lighting, deep shadows, authentic rain reflections'}, matching environment sheet.`,
          `Camera: ${cameraSpec.type}, shot on ${cameraSpec.lens} on ${cameraSpec.rig}, authentic 35mm anamorphic bokeh, true motion blur and speed ramping.`,
          photorealFidelity,
          physicsGuardrail,
          cameraSpec.flag,
          `--seed-frame-ref "${character.sheetPath || scene.sheetPath || 'auto'}"`,
          `--aspect-ratio 16:9`,
          `--motion-intensity 7`,
          `--negative-prompt "${PromptEngine.getMasterNegativePrompt()}"`
        ].join(' ');
      } else {
        flowPrompt = [
          `Cinematic documentary shot: ${beat.action || beat.description}.`,
          `Subject: ${character.name}, matching character turnaround sheet in ${character.clothing || 'exact wardrobe'}.`,
          `Environment: ${scene.location}, ${scene.lighting || 'natural 3200K key light with atmospheric depth'}, matching environment sheet.`,
          `Camera: ${cameraSpec.type}, ${cameraSpec.lens} on ${cameraSpec.rig}, authentic anamorphic bokeh and natural depth of field.`,
          photorealFidelity,
          physicsGuardrail,
          cameraSpec.flag,
          `--seed-frame-ref "${character.sheetPath || scene.sheetPath || 'auto'}"`,
          `--aspect-ratio 16:9`,
          `--motion-intensity 5`,
          `--negative-prompt "${PromptEngine.getMasterNegativePrompt()}"`
        ].join(' ');
      }

      // Crew Verification Stamp
      const crewStamp = {
        director: {
          intent: beat.title || `Beat ${shotNum}`,
          blocking: beat.action || beat.description,
          status: 'APPROVED // MOVIE-COMMERCIAL CONTINUITY'
        },
        cinematographer: {
          lens: cameraSpec.lens,
          rig: cameraSpec.rig,
          framing: cameraSpec.type,
          opticalBokeh: 'Organic anamorphic oval bokeh, f/2.0'
        },
        gafferAndLighting: {
          skinRendering: 'Subsurface Scattering (SSS) Active & Epidermal Pores',
          colorTemperature: 'Warm Amber Workbench (2800K) vs Cold Storm Cyan (6500K)',
          contrastRatio: '10:1 Cinematic Low-Key Chiaroscuro'
        },
        vfxAndPhysics: {
          collisionIntegrity: 'STRICT LOCK // ZERO NOCLIP',
          phasingShield: 'Doors, drafting tables, and chairs are rigid solids',
          fluidDynamics: 'Hydrophobic water beading & splash displacement locked'
        },
        continuityLead: {
          eyelineRule: '180-Degree Axis Maintained',
          wardrobeMatch: 'Locked to Technical Jacket Model Sheet',
          spatialTopology: 'Atelier Interior to Outdoor Storm Transition Verified'
        }
      };

      shotList.push({
        id: `shot-${shotNum}`,
        code: `SC01_SH0${shotNum}`,
        sceneTitle: beat.title || `Beat ${shotNum}`,
        narration: beat.narration || beat.description,
        character: character.name,
        characterSheetRef: character.sheetPath || null,
        environment: scene.location,
        sceneSheetRef: scene.sheetPath || null,
        framing: cameraSpec.type,
        lens: cameraSpec.lens,
        cameraFlag: cameraSpec.flag,
        physicsConstraint: cameraSpec.physicsConstraint,
        googleFlowPrompt: flowPrompt,
        suggestedDurationSec: beat.durationSec || 4,
        suggestedDurationFrames: (beat.durationSec || 4) * 30,
        crew: crewStamp,
        status: 'ready_for_generation',
        videoClipUrl: null
      });
    });

    return shotList;
  }
}

module.exports = PromptEngine;
