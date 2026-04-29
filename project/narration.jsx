// narration.jsx — MP3-based narration with synchronized captions.
//
// Plays a pre-rendered MP3 per scene (one file per scene name).
// Captions are derived from the script text and distributed across the audio
// duration, so they advance in time with the spoken words even though we
// don't have word-level timing.
//
// Audio file resolution:
//   1. If window.__resources[`narr_${slug}`] exists (standalone bundle),
//      use that blob URL.
//   2. Otherwise load from `narration-audio/${file}` directly.

// ── Narration scripts (used for caption rendering) ──
const NARRATION = {
  'Cold Open':         "NH Care Center.",
  'Welcome':           "Welcome. Whether you're a nurse, an aide, or office staff, this orientation is the foundation for every visit you'll make. It takes about ten minutes. Let's begin.",
  'Who We Are':        "We're a New Hampshire-licensed home health agency based in Concord, serving clients across the state under state code He-P 809 and RSA 151. Care happens in the home — the patient's home.",
  'Mission':           "Our mission is simple: deliver compassionate, dignified, person-centered care that helps clients stay safely in the place they call home.",

  'Ch.1 Patient-Centered Care': "Chapter One. Patient-centered care.",
  'Two Service Tracks': "We offer two tracks of service. Skilled nursing — assessments, medications, wound care, IV therapy, delivered by RNs and LPNs. And non-medical personal care — bathing, grooming, mobility, household support, companionship — delivered by LNAs, home health aides, and personal care assistants. Both tracks operate under the same plan of care, the same standards, and the same rights.",
  'The 14 Rights':      "Every client carries fourteen specific rights with them — under New Hampshire RSA 151:21-b. The right to be informed. The right to participate in their plan of care. The right to refuse treatment. The right to privacy and confidentiality. The right to voice grievances without retaliation. The right to be free from abuse and neglect. The right to know who is providing their care, and the right to a safe environment. Memorize these. Live them.",
  'Freedom from Abuse': "Patients have an absolute right to be free from physical, verbal, sexual, and psychological abuse — and from financial exploitation. Restraints, whether physical or chemical, are never used for staff convenience or discipline. Only with a physician order, for the patient's safety, and only as a last resort.",

  'Ch.2 Privacy & HIPAA': "Chapter Two. Privacy is the work.",
  'HIPAA Uses':         "Protected Health Information — PHI — may be used or disclosed for treatment, payment, and operations. That's it, by default. Anything else — research, marketing, sharing with family — requires the patient's written authorization. The minimum necessary rule applies: share only what's needed.",
  'Sensitive Info':     "Some categories carry heightened protection. Mental health records, substance use treatment records under 42 CFR Part 2, HIV and AIDS status, and genetic information. These cannot be released even to other providers without specific written authorization. When in doubt, don't disclose — call the privacy officer.",

  'Ch.3 Safety':        "Chapter Three. Safety in every home.",
  'Hand Hygiene':       "Hand hygiene is the single most effective infection-control measure. Five moments: before patient contact, before a clean or aseptic task, after exposure to body fluids, after patient contact, and after touching the patient's surroundings. Soap and water for visibly soiled hands. Alcohol-based rub otherwise.",
  'PPE':                "PPE — personal protective equipment. Gloves whenever you may contact body fluids. Gowns when splashing is possible. Masks and eye protection for respiratory or splash-risk situations. Don in this order: gown, mask, eye protection, gloves. Doff in reverse — and perform hand hygiene immediately after.",
  'Precautions':        "Beyond standard precautions, transmission-based precautions add layers. Contact for MRSA and C. difficile — gown and gloves. Droplet for influenza and pertussis — surgical mask within six feet. Airborne for tuberculosis and measles — N-95 respirator, fit-tested.",
  'Bag Technique':      "The nursing bag is a clean zone. Place it on a barrier — never the floor, never the patient's bed. Take only what you need out. Clean reusable items before they go back in. Designate a separate dirty pocket or pouch for items going home for cleaning.",
  'Sharps & Needlesticks': "Sharps containers are puncture-proof, fluid-tight, and biohazard-labeled. Replace at three-quarters full. If you experience a needlestick: wash with soap and water immediately. Report to your supervisor within the hour. Begin the post-exposure plan — source testing, baseline labs, follow-up. Do not delay.",

  'Ch.4 The Work':      "Chapter Four. How the care happens.",
  'Onboarding':         "Every new patient follows a structured intake. Referral received. Triage to determine skilled or non-medical track. Initial nursing assessment within five days for skilled cases — sooner if urgent. Plan of care drafted. Patient signs consent and acknowledges the bill of rights. Care begins.",
  'Plan of Care':       "The plan of care — the POC — is the contract. It lists diagnoses, medications, frequency of visits, specific tasks, goals, and expected outcomes. The physician signs it. Nurses recertify it every sixty days. Aides receive a written task list drawn from it. Deviation requires a phone call, not a guess.",
  'Delegation':         "RNs may delegate certain tasks to LNAs and home health aides — but only after assessing competence, only for stable patients, and only with documented training. Aides administer medication only when delegated and trained per state law. Aides do not perform sterile procedures, IV care, or clinical assessment — ever.",
  'Documentation':      "If it isn't documented, it didn't happen. Every visit produces a note: tasks performed, patient response, vitals if taken, education provided, communication with the team. Late entries are clearly marked. Errors are corrected with a single line, your initials, and the date — never erased.",

  'Ch.5 People & Quality': "Chapter Five. People and quality.",
  'Training':           "Every direct-care employee completes general orientation, dementia training under RSA 151:47-51, and a competency evaluation before working independently. Annual in-service education covers infection control, emergency preparedness, abuse prevention, HIPAA, and any new clinical topics. Training is tracked. No skipping.",
  'Reporting':          "Mandatory reporting. Suspected abuse, neglect, or exploitation of a vulnerable adult — report to the Bureau of Elderly and Adult Services. Suspected child abuse — report to DCYF. You report directly. You may report through the agency, but the legal duty is yours. Retaliation against a reporter is a separate offense.",
  'Emergency Prep':     "Every patient is triaged for emergency vulnerability — high, medium, or low — based on dependence on power, oxygen, or skilled care. During an emergency, high-priority patients are contacted first. We coordinate with local EMS and emergency management. Drills happen twice a year. You'll know your role.",
  'Quality Assurance':  "Quality assurance is continuous. The QAPI committee reviews charts, tracks adverse events, surveys patient satisfaction, and conducts an annual agency evaluation. Findings drive change. You'll be asked for input — your eyes are part of the system.",

  'Governance':         "We operate under New Hampshire's home health regulations — He-P 809 — reviewed every two years. Care is provided without discrimination. Required notices are posted at every office. And clinical and billing records are always truthful: falsification is grounds for termination and may be reported to licensing boards.",
  'Firearms':           "Many New Hampshire homes keep firearms. Our staff do not handle, store, clean, or move them — ever. If you see one in the work area, ask the client or family to secure it before care continues. If they refuse and you feel unsafe, leave and call the on-call supervisor. Document the refusal. Your safety comes first.",
  'Personal Care Detail': "Non-medical care covers hygiene and grooming, household support, companionship, mobility support, and in-home respite. What aides do NOT do: injections, wound care, medication administration without RN delegation, or clinical assessment.",
  'Skilled Nursing Detail': "Skilled nursing includes admission assessments and sixty-day recertifications, medication management under He-P 809.16, advanced procedures like wound care and IV therapy, tube-feeding management, chronic disease monitoring, and diabetic care.",
  'Personnel':          "Every direct-care employee passes the same gate before their first visit: criminal background check, the New Hampshire BEAS Elder Abuse Registry, OIG and SAM exclusion lists, TB testing, current license or LNA registry, CPR certification, and two professional references.",
  'Dementia':           "Dementia training is required by New Hampshire RSA 151:47-51. You'll learn the stages of dementia, behavioral expressions of unmet needs, validation therapy, and redirection. Take it within your first ninety days, refresh annually. In practice: approach from the front, speak slowly, offer two choices, validate feelings before redirecting.",
  'Grievance':          "Patients may file complaints — with us, or directly with the State — without fear of reprisal. With the agency: complaint to the Administrator, investigation within five business days, written response within fourteen days. With the State: NH DHHS Health Facilities Administration, Bureau of Licensing and Certification, six oh three two seven one nine zero three nine.",
  'Discharge':          "Discharge is a clinical event, not paperwork. Valid reasons include goals met, moving out of the area, refusal after counseling, safety threats, non-payment after notice, or physician order. Thirty days written notice is standard. Patients have a right to dispute through DHHS. A written discharge plan goes to the patient and primary care provider.",
  'Cleaning & Waste':   "After every patient: clean visible soil, then disinfect with EPA-registered hospital-grade disinfectant. Single-use items never travel between homes. Soiled linens stay at the patient's home. Sharps containers are replaced at three-quarters full. For blood spills, absorb, clean, then disinfect with a ten-percent bleach solution.",
  'Advance Directives': "Every patient is asked at admission about Living Wills, durable Power of Attorney for health care, and POLST or MOLST forms. Document the existence — or absence — of each. Place copies in the chart. Honor them. Re-ask at recertification, because patients may change directives at any time.",
  'Controlled Substances': "Controlled substance diversion is a felony. Skilled nursing counts and documents on every visit. Aides do not handle, count, or transport controlled substances. Disposal of partial doses requires a witnessed signature. If you suspect diversion — yours, a coworker's, or a family member's — call the Administrator the same day. Confidential.",
  'Records':            "Adult records are kept seven years after discharge. Minor records until age twenty-one or seven years, whichever is longer. Every entry is signed with name, credential, date, and time. Corrections use a single strikethrough — never erasure. Late entries are clearly marked. Releases of information require written, signed authorization.",
  'Reportable to DHHS': "Some events go straight to the State within twenty-four hours: unexpected patient death related to care, suspected abuse, serious injury, medication errors with harm, communicable disease outbreaks, theft of patient PHI, staff impairment on duty, and fire or evacuation. The Administrator reports. Your job is to tell the Administrator immediately.",

  'Recap':              "Five anchors. Patient first. Privacy is protected. Safety is shared. Care has a plan. Speak up.",
  'Acknowledgment':     "You've completed the orientation. Type your name below to acknowledge that you've reviewed this material, agree to follow it, and understand you can ask the Administrator any time you have questions. Welcome to NH Care Center.",
};

// ── Manifest: name → audio file (matches narration-audio/manifest.json) ──
// Each scene name maps to an MP3 numbered by its position in the NARRATION
// object (which is the order the audio files were generated in).
const NARRATION_ORDER = Object.keys(NARRATION);
const AUDIO_FILES = {};
NARRATION_ORDER.forEach((name, i) => {
  AUDIO_FILES[name] = `${String(i+1).padStart(2,'0')}.mp3`;
});

// Approximate audio durations (from manifest) — used as fallback before metadata loads
const AUDIO_DURATIONS = {
  'Cold Open': 2.12, 'Welcome': 12.83, 'Who We Are': 14.73, 'Mission': 9.72,
  'Ch.1 Patient-Centered Care': 3.97, 'Two Service Tracks': 28.11, 'The 14 Rights': 33.36,
  'Freedom from Abuse': 22.86, 'Ch.2 Privacy & HIPAA': 3.97, 'HIPAA Uses': 20.17,
  'Sensitive Info': 25.13, 'Ch.3 Safety': 3.74, 'Hand Hygiene': 23.04, 'PPE': 23.09,
  'Precautions': 22.49, 'Bag Technique': 18.91, 'Sharps & Needlesticks': 24.58,
  'Ch.4 The Work': 3.19, 'Onboarding': 20.27, 'Plan of Care': 24.29, 'Delegation': 23.69,
  'Documentation': 21.05, 'Ch.5 People & Quality': 3.74, 'Training': 29.18,
  'Reporting': 26.49, 'Emergency Prep': 24.29, 'Quality Assurance': 19.10,
  'Governance': 23.61, 'Firearms': 25.94, 'Personal Care Detail': 17.61,
  'Skilled Nursing Detail': 21.89, 'Personnel': 21.34, 'Dementia': 28.29,
  'Grievance': 32.94, 'Discharge': 25.42, 'Cleaning & Waste': 26.54,
  'Advance Directives': 24.11, 'Controlled Substances': 27.22, 'Records': 25.18,
  'Reportable to DHHS': 25.18, 'Recap': 9.67, 'Acknowledgment': 15.62,
};

// Resolve a scene name to an audio source URL.
function audioSrcFor(name) {
  const file = AUDIO_FILES[name];
  if (!file) return null;
  // Standalone bundle: window.__resources['narr_<file>'] is a blob URL
  const id = 'narr_' + file.replace('.mp3', '');
  if (window.__resources && window.__resources[id]) {
    return window.__resources[id];
  }
  return `narration-audio/${file}`;
}

// Split a paragraph into sentences (keeping the punctuation).
function splitSentences(text) {
  const parts = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g);
  return (parts || [text]).map(s => s.trim()).filter(Boolean);
}

// Build caption cues for a script: distribute sentences across audio duration
// proportionally to their character count.
function buildCaptionCues(text, audioDuration) {
  const sentences = splitSentences(text);
  if (!sentences.length) return [];
  const totalChars = sentences.reduce((a, s) => a + s.length, 0);
  let t = 0;
  const cues = [];
  for (const s of sentences) {
    const dur = (s.length / totalChars) * audioDuration;
    cues.push({ text: s, start: t, end: t + dur });
    t += dur;
  }
  return cues;
}

// Cache caption cues per scene name (rebuilt when audio metadata loads)
const CUE_CACHE = {};
function getCaptionAt(sceneName, sceneRelTime) {
  let cues = CUE_CACHE[sceneName];
  if (!cues) {
    const text = NARRATION[sceneName] || '';
    const dur = AUDIO_DURATIONS[sceneName] || 3;
    cues = buildCaptionCues(text, dur);
    CUE_CACHE[sceneName] = cues;
  }
  const cue = cues.find(c => sceneRelTime >= c.start && sceneRelTime < c.end);
  return cue ? cue.text : '';
}

// ── Hook: audio playback synchronized with the Stage timeline ──
function useNarration({ enabled, volume, sceneTimeline }) {
  const { time, playing } = useTimeline();
  const audioRef = React.useRef(null);
  const currentSceneRef = React.useRef(null);
  const [captionText, setCaptionText] = React.useState('');

  // Find current scene by time
  const currentScene = sceneTimeline.find(s => time >= s.start && time < s.end);
  const sceneName = currentScene ? currentScene.name : null;
  const sceneRelTime = currentScene ? time - currentScene.start : 0;

  // Initialize audio element once
  React.useEffect(() => {
    const a = new Audio();
    a.preload = 'auto';
    audioRef.current = a;
    return () => {
      try { a.pause(); a.src = ''; } catch {}
      audioRef.current = null;
    };
  }, []);

  // Switch source when scene changes
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!enabled) {
      try { a.pause(); } catch {}
      currentSceneRef.current = null;
      return;
    }
    if (!sceneName) return;
    if (currentSceneRef.current === sceneName) return;
    currentSceneRef.current = sceneName;
    const src = audioSrcFor(sceneName);
    if (!src) {
      try { a.pause(); a.src = ''; } catch {}
      return;
    }
    a.src = src;
    a.load();
    // Cache real duration for caption alignment when metadata arrives
    a.onloadedmetadata = () => {
      if (Number.isFinite(a.duration) && a.duration > 0) {
        AUDIO_DURATIONS[sceneName] = a.duration;
        delete CUE_CACHE[sceneName]; // rebuild cues with real duration
      }
    };
  }, [sceneName, enabled]);

  // Volume
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Sync playback position with timeline (seek when drift > 0.25s)
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a || !enabled || !sceneName) return;
    const target = Math.max(0, sceneRelTime);
    // Don't seek past the end of the audio
    if (Number.isFinite(a.duration) && target > a.duration) {
      try { a.pause(); } catch {}
      return;
    }
    if (Math.abs(a.currentTime - target) > 0.25) {
      try { a.currentTime = target; } catch {}
    }
  }, [sceneName, sceneRelTime, enabled]);

  // Play / pause tied to Stage state
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a || !enabled) return;
    if (playing) {
      const p = a.play();
      if (p && p.catch) p.catch(() => {/* autoplay blocked, ignore */});
    } else {
      try { a.pause(); } catch {}
    }
  }, [playing, enabled, sceneName]);

  // Mute audio entirely when narration disabled
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!enabled) {
      try { a.pause(); } catch {}
    }
  }, [enabled]);

  // Update caption text from current sceneRelTime
  React.useEffect(() => {
    if (!enabled || !sceneName) {
      setCaptionText('');
      return;
    }
    const t = getCaptionAt(sceneName, sceneRelTime);
    setCaptionText(t);
  }, [sceneName, sceneRelTime, enabled]);

  return { captionText, sceneName };
}

// ── Caption strip — rendered into the letterbox below the canvas via portal ──
function Captions({ text, show }) {
  const [target, setTarget] = React.useState(null);
  React.useEffect(() => {
    const find = () => {
      const el = document.getElementById('stage-letterbox-slot');
      if (el) setTarget(el); else requestAnimationFrame(find);
    };
    find();
  }, []);
  if (!show || !text || !target) return null;
  return ReactDOM.createPortal(
    <div style={{
      maxWidth: '90%',
      padding: '10px 24px',
      background: 'rgba(20, 28, 38, 0.85)',
      color: '#FAF4E6',
      fontFamily: 'Nunito, system-ui, sans-serif',
      fontSize: 18,
      lineHeight: 1.4,
      borderRadius: 8,
      textAlign: 'center',
      backdropFilter: 'blur(6px)',
      pointerEvents: 'none',
      textWrap: 'balance',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }}>
      {text}
    </div>,
    target
  );
}

// ── Narration controller renders captions and drives audio ──
function NarrationLayer({ enabled, volume, captionsOn, sceneTimeline }) {
  const { captionText } = useNarration({ enabled, volume, sceneTimeline });
  return <Captions text={captionText} show={captionsOn && enabled} />;
}

Object.assign(window, { NARRATION, AUDIO_FILES, AUDIO_DURATIONS, useNarration, Captions, NarrationLayer });
