import { StoryManifest } from '../../types/story';

export const ACTIVE_STORY: StoryManifest = {
  "id": "ai-studio-1795406554676",
  "title": "THE LAGOS RELOCATION // CHATTY COMMERCIAL",
  "description": "A sharp 28-year-old corporate professional receives a surprise promotion to Head of Marketing in Lagos State, required to resume by Monday. After 16 grueling, frustrating hours scouring scammy apartment sites late into the night, he slams his desk in exhaustion: 'Damn it! It shouldn't be this hard.' Grabbing his car keys, he escapes to an upscale Victoria Island lounge to vent to his friend. His friend smirks with disbelief: 'Oh, really? You still do that?' and introduces him to Chatty on WhatsApp. With an on-screen countdown timer ticking, he types: 'Hey Chatty, I need a 2-bedroom apartment in Lekki Phase 1.' In seconds, verified cards arrive, he previews the unit, books a virtual inspection, and hops onto an instant live video walkthrough with an agent. Over the call, he grins: 'I'll go for this.' Next morning, he packs his bags with total swagger: 'Lagos, here I come.' Outro: 'Finding your next home shouldn't take weeks. It takes seconds. Chat Chatty on WhatsApp at 091... and move in.'",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "aspectRatio": "16:9",
  "musicTrack": {
    "src": "/audio/music/documentary-pulse.wav",
    "volume": 0.3,
    "duckVolume": 0.08
  },
  "voiceoverTrack": {
    "src": "/audio/studio-active-voiceover.mp3",
    "volume": 1
  },
  "theme": {
    "primaryColor": "#0a0d14",
    "accentColor": "#ff5500",
    "textColor": "#ffffff",
    "paperColor": "#f4ebd0",
    "fontFamilyHeading": "Impact, \"Montserrat Black\", sans-serif",
    "fontFamilyBody": "\"Chakra Petch\", sans-serif"
  },
  "scenes": [
    {
      "id": "SC01_SH01",
      "title": "Scene 01 // The Executive Promotion",
      "durationInFrames": 120,
      "transition": "none",
      "transitionDuration": 15,
      "background": {
        "type": "grid",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 01 // THE EXECUTIVE PROMOTION",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Macro Workbench Slider Push-In"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-1",
          "startFrame": 3,
          "endFrame": 201,
          "startMs": 100,
          "endMs": 6687.5,
          "text": "When a career-defining promotion lands on your desk on Friday... and you have to resume in Lagos on Monday.",
          "words": [
            {
              "word": "When",
              "startFrame": 3,
              "endFrame": 13
            },
            {
              "word": "a",
              "startFrame": 13,
              "endFrame": 24
            },
            {
              "word": "career-defining",
              "startFrame": 24,
              "endFrame": 34
            },
            {
              "word": "promotion",
              "startFrame": 34,
              "endFrame": 45
            },
            {
              "word": "lands",
              "startFrame": 45,
              "endFrame": 55
            },
            {
              "word": "on",
              "startFrame": 55,
              "endFrame": 66
            },
            {
              "word": "your",
              "startFrame": 66,
              "endFrame": 76
            },
            {
              "word": "desk",
              "startFrame": 76,
              "endFrame": 86
            },
            {
              "word": "on",
              "startFrame": 86,
              "endFrame": 97
            },
            {
              "word": "Friday...",
              "startFrame": 97,
              "endFrame": 107
            },
            {
              "word": "and",
              "startFrame": 107,
              "endFrame": 118
            },
            {
              "word": "you",
              "startFrame": 118,
              "endFrame": 128
            },
            {
              "word": "have",
              "startFrame": 128,
              "endFrame": 138
            },
            {
              "word": "to",
              "startFrame": 138,
              "endFrame": 149
            },
            {
              "word": "resume",
              "startFrame": 149,
              "endFrame": 159
            },
            {
              "word": "in",
              "startFrame": 159,
              "endFrame": 170
            },
            {
              "word": "Lagos",
              "startFrame": 170,
              "endFrame": 180
            },
            {
              "word": "on",
              "startFrame": 180,
              "endFrame": 191
            },
            {
              "word": "Monday.",
              "startFrame": 191,
              "endFrame": 201
            }
          ]
        },
        {
          "id": "cap-2",
          "startFrame": 199,
          "endFrame": 294,
          "startMs": 6637.5,
          "endMs": 9787.5,
          "text": "Sixteen hours searching for an apartment.",
          "words": [
            {
              "word": "Sixteen",
              "startFrame": 199,
              "endFrame": 215
            },
            {
              "word": "hours",
              "startFrame": 215,
              "endFrame": 231
            },
            {
              "word": "searching",
              "startFrame": 231,
              "endFrame": 246
            },
            {
              "word": "for",
              "startFrame": 246,
              "endFrame": 262
            },
            {
              "word": "an",
              "startFrame": 262,
              "endFrame": 278
            },
            {
              "word": "apartment.",
              "startFrame": 278,
              "endFrame": 294
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-0",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-0",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH02",
      "title": "Scene 02 // The Apartment Hunt Nightmare & Desk Slam",
      "durationInFrames": 120,
      "transition": "paper-tear",
      "transitionDuration": 15,
      "background": {
        "type": "dots",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 02 // THE APARTMENT HUNT NIGHTMARE & DESK SLAM",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Medium Grounded Tracking Push"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-3",
          "startFrame": 294,
          "endFrame": 356,
          "startMs": 9787.5,
          "endMs": 11850,
          "text": "Dead-end listings.",
          "words": [
            {
              "word": "Dead-end",
              "startFrame": 294,
              "endFrame": 325
            },
            {
              "word": "listings.",
              "startFrame": 325,
              "endFrame": 356
            }
          ]
        },
        {
          "id": "cap-4",
          "startFrame": 356,
          "endFrame": 416,
          "startMs": 11850,
          "endMs": 13875,
          "text": "Shady agents.",
          "words": [
            {
              "word": "Shady",
              "startFrame": 356,
              "endFrame": 386
            },
            {
              "word": "agents.",
              "startFrame": 386,
              "endFrame": 416
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-1",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-1",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH03",
      "title": "Scene 03 // The Escape to the Lounge",
      "durationInFrames": 120,
      "transition": "film-flash",
      "transitionDuration": 15,
      "background": {
        "type": "grid",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 03 // THE ESCAPE TO THE LOUNGE",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Low-Angle Cataclysmic Dolly Forward"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-5",
          "startFrame": 416,
          "endFrame": 481,
          "startMs": 13875,
          "endMs": 16025,
          "text": "It shouldn't be this hard.",
          "words": [
            {
              "word": "It",
              "startFrame": 416,
              "endFrame": 429
            },
            {
              "word": "shouldn't",
              "startFrame": 429,
              "endFrame": 442
            },
            {
              "word": "be",
              "startFrame": 442,
              "endFrame": 455
            },
            {
              "word": "this",
              "startFrame": 455,
              "endFrame": 468
            },
            {
              "word": "hard.",
              "startFrame": 468,
              "endFrame": 481
            }
          ]
        },
        {
          "id": "cap-6",
          "startFrame": 481,
          "endFrame": 581,
          "startMs": 16025,
          "endMs": 19362.5,
          "text": "In Lagos, you don't fight the old system.",
          "words": [
            {
              "word": "In",
              "startFrame": 481,
              "endFrame": 494
            },
            {
              "word": "Lagos,",
              "startFrame": 494,
              "endFrame": 506
            },
            {
              "word": "you",
              "startFrame": 506,
              "endFrame": 518
            },
            {
              "word": "don't",
              "startFrame": 518,
              "endFrame": 531
            },
            {
              "word": "fight",
              "startFrame": 531,
              "endFrame": 544
            },
            {
              "word": "the",
              "startFrame": 544,
              "endFrame": 556
            },
            {
              "word": "old",
              "startFrame": 556,
              "endFrame": 568
            },
            {
              "word": "system.",
              "startFrame": 568,
              "endFrame": 581
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-2",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-2",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH04",
      "title": "Scene 04 // The Chatty WhatsApp Reveal",
      "durationInFrames": 120,
      "transition": "fade",
      "transitionDuration": 15,
      "background": {
        "type": "dots",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 04 // THE CHATTY WHATSAPP REVEAL",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Dynamic Pursuit Tracking Shot"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-7",
          "startFrame": 581,
          "endFrame": 650,
          "startMs": 19362.5,
          "endMs": 21662.5,
          "text": "You discover the shortcut.",
          "words": [
            {
              "word": "You",
              "startFrame": 581,
              "endFrame": 598
            },
            {
              "word": "discover",
              "startFrame": 598,
              "endFrame": 616
            },
            {
              "word": "the",
              "startFrame": 616,
              "endFrame": 633
            },
            {
              "word": "shortcut.",
              "startFrame": 633,
              "endFrame": 650
            }
          ]
        },
        {
          "id": "cap-8",
          "startFrame": 650,
          "endFrame": 701,
          "startMs": 21662.5,
          "endMs": 23375,
          "text": "Meet Chatty.",
          "words": [
            {
              "word": "Meet",
              "startFrame": 650,
              "endFrame": 676
            },
            {
              "word": "Chatty.",
              "startFrame": 676,
              "endFrame": 701
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-3",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-3",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH05",
      "title": "Scene 05 // The 45-Second Virtual Inspection",
      "durationInFrames": 150,
      "transition": "whip-pan",
      "transitionDuration": 15,
      "background": {
        "type": "grid",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 05 // THE 45-SECOND VIRTUAL INSPECTION",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Macro Workbench Slider Push-In"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-9",
          "startFrame": 701,
          "endFrame": 824,
          "startMs": 23375,
          "endMs": 27475,
          "text": "The AI rental assistant living right inside your WhatsApp.",
          "words": [
            {
              "word": "The",
              "startFrame": 701,
              "endFrame": 715
            },
            {
              "word": "AI",
              "startFrame": 715,
              "endFrame": 728
            },
            {
              "word": "rental",
              "startFrame": 728,
              "endFrame": 742
            },
            {
              "word": "assistant",
              "startFrame": 742,
              "endFrame": 756
            },
            {
              "word": "living",
              "startFrame": 756,
              "endFrame": 769
            },
            {
              "word": "right",
              "startFrame": 769,
              "endFrame": 783
            },
            {
              "word": "inside",
              "startFrame": 783,
              "endFrame": 797
            },
            {
              "word": "your",
              "startFrame": 797,
              "endFrame": 810
            },
            {
              "word": "WhatsApp.",
              "startFrame": 810,
              "endFrame": 824
            }
          ]
        },
        {
          "id": "cap-10",
          "startFrame": 824,
          "endFrame": 902,
          "startMs": 27475,
          "endMs": 30050,
          "text": "Instant verified listings.",
          "words": [
            {
              "word": "Instant",
              "startFrame": 824,
              "endFrame": 850
            },
            {
              "word": "verified",
              "startFrame": 850,
              "endFrame": 876
            },
            {
              "word": "listings.",
              "startFrame": 876,
              "endFrame": 902
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-4",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-4",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH06",
      "title": "Scene 06 // Packing Bags & Ready to Roll",
      "durationInFrames": 90,
      "transition": "paper-tear",
      "transitionDuration": 15,
      "background": {
        "type": "dots",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 06 // PACKING BAGS & READY TO ROLL",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Medium Grounded Tracking Push"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-11",
          "startFrame": 902,
          "endFrame": 959,
          "startMs": 30050,
          "endMs": 31962.5,
          "text": "Zero middlemen.",
          "words": [
            {
              "word": "Zero",
              "startFrame": 902,
              "endFrame": 930
            },
            {
              "word": "middlemen.",
              "startFrame": 930,
              "endFrame": 959
            }
          ]
        },
        {
          "id": "cap-12",
          "startFrame": 959,
          "endFrame": 1070,
          "startMs": 31962.5,
          "endMs": 35675,
          "text": "Live virtual walkthroughs in under sixty seconds.",
          "words": [
            {
              "word": "Live",
              "startFrame": 959,
              "endFrame": 975
            },
            {
              "word": "virtual",
              "startFrame": 975,
              "endFrame": 991
            },
            {
              "word": "walkthroughs",
              "startFrame": 991,
              "endFrame": 1007
            },
            {
              "word": "in",
              "startFrame": 1007,
              "endFrame": 1022
            },
            {
              "word": "under",
              "startFrame": 1022,
              "endFrame": 1038
            },
            {
              "word": "sixty",
              "startFrame": 1038,
              "endFrame": 1054
            },
            {
              "word": "seconds.",
              "startFrame": 1054,
              "endFrame": 1070
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-5",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-5",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    },
    {
      "id": "SC01_SH07",
      "title": "Scene 07 // The Official Brand Outro",
      "durationInFrames": 120,
      "transition": "film-flash",
      "transitionDuration": 15,
      "background": {
        "type": "grid",
        "showCoordinates": true,
        "showGrain": true,
        "color": "#0a0d14"
      },
      "camera": {
        "zoom": [
          1,
          1.08
        ],
        "tilt": [
          0,
          -1
        ],
        "panX": [
          0,
          10
        ],
        "shakeIntensity": 0.8
      },
      "headline": {
        "text": "SCENE 07 // THE OFFICIAL BRAND OUTRO",
        "highlightWords": [
          "FEMI (HEAD OF MARKETING)"
        ],
        "animation": "staggered-slide",
        "subtitle": "Low-Angle Cataclysmic Dolly Forward"
      },
      "cutouts": [
        {
          "src": "/assets/characters/femi_lead_sheet.png",
          "scale": 0.85,
          "x": 0,
          "y": 0,
          "polaroid": true
        }
      ],
      "captions": [
        {
          "id": "cap-13",
          "startFrame": 1070,
          "endFrame": 1191,
          "startMs": 35675,
          "endMs": 39687.5,
          "text": "Packed, ready, and moving in on your own terms.",
          "words": [
            {
              "word": "Packed,",
              "startFrame": 1070,
              "endFrame": 1083
            },
            {
              "word": "ready,",
              "startFrame": 1083,
              "endFrame": 1097
            },
            {
              "word": "and",
              "startFrame": 1097,
              "endFrame": 1110
            },
            {
              "word": "moving",
              "startFrame": 1110,
              "endFrame": 1124
            },
            {
              "word": "in",
              "startFrame": 1124,
              "endFrame": 1137
            },
            {
              "word": "on",
              "startFrame": 1137,
              "endFrame": 1151
            },
            {
              "word": "your",
              "startFrame": 1151,
              "endFrame": 1164
            },
            {
              "word": "own",
              "startFrame": 1164,
              "endFrame": 1178
            },
            {
              "word": "terms.",
              "startFrame": 1178,
              "endFrame": 1191
            }
          ]
        },
        {
          "id": "cap-14",
          "startFrame": 1191,
          "endFrame": 1283,
          "startMs": 39687.5,
          "endMs": 42762.5,
          "text": "Finding your next home shouldn't take weeks.",
          "words": [
            {
              "word": "Finding",
              "startFrame": 1191,
              "endFrame": 1204
            },
            {
              "word": "your",
              "startFrame": 1204,
              "endFrame": 1217
            },
            {
              "word": "next",
              "startFrame": 1217,
              "endFrame": 1230
            },
            {
              "word": "home",
              "startFrame": 1230,
              "endFrame": 1244
            },
            {
              "word": "shouldn't",
              "startFrame": 1244,
              "endFrame": 1257
            },
            {
              "word": "take",
              "startFrame": 1257,
              "endFrame": 1270
            },
            {
              "word": "weeks.",
              "startFrame": 1270,
              "endFrame": 1283
            }
          ]
        }
      ],
      "soundEffects": [
        {
          "id": "sfx-whoosh-6",
          "frame": 2,
          "type": "whoosh",
          "volume": 0.7
        },
        {
          "id": "sfx-pop-6",
          "frame": 20,
          "type": "pop",
          "volume": 0.5
        }
      ]
    }
  ]
};
