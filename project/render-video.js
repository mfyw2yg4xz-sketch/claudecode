#!/usr/bin/env node
/**
 * NH Care Center Orientation — Video Renderer
 *
 * Captures the animated orientation as a clean 1920×1080 MP4 with narration.
 *
 * How it works:
 *   1. Serves the project over a local HTTP server
 *   2. Opens Chromium via Playwright with video recording enabled
 *   3. Runs the animation at 2× speed (halves recording time)
 *   4. Builds the narration audio track from the MP3 files
 *   5. Slows the video back to 1× with ffmpeg
 *   6. Merges video + audio → NH-Care-Center-Orientation.mp4
 *
 * Usage:
 *   node render-video.js
 *
 * Requirements:
 *   - Node.js 18+
 *   - playwright npm package  (npm install playwright)
 *   - ffmpeg (installed via Playwright: npx playwright install-deps)
 *
 * Output:  ./NH-Care-Center-Orientation.mp4  (~15 min, 1920×1080)
 * Runtime: ~8–10 minutes (animation runs at 2× speed)
 */

'use strict';

// Try local playwright install first, then fall back to global
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const os    = require('os');
const { execSync, spawnSync } = require('child_process');

// ── Config ────────────────────────────────────────────────────────────────────
const PROJECT_DIR   = __dirname;
const FFMPEG        = '/usr/bin/ffmpeg';
const MANIFEST_PATH = path.join(PROJECT_DIR, 'narration-audio', 'manifest.json');
const OUTPUT_PATH   = path.join(PROJECT_DIR, 'NH-Care-Center-Orientation.mp4');
const SPEED_MULT    = 2;   // animation plays this many × faster during recording

// ── Scene timeline (must match SCENES array in the HTML) ─────────────────────
const SCENES = [
  { name: 'Cold Open',                   dur: 3  },
  { name: 'Welcome',                     dur: 14 },
  { name: 'Who We Are',                  dur: 16 },
  { name: 'Mission',                     dur: 11 },
  { name: 'Ch.1 Patient-Centered Care',  dur: 5  },
  { name: 'Two Service Tracks',          dur: 29 },
  { name: 'The 14 Rights',               dur: 34 },
  { name: 'Freedom from Abuse',          dur: 24 },
  { name: 'Ch.2 Privacy & HIPAA',        dur: 5  },
  { name: 'HIPAA Uses',                  dur: 21 },
  { name: 'Sensitive Info',              dur: 26 },
  { name: 'Ch.3 Safety',                 dur: 5  },
  { name: 'Hand Hygiene',                dur: 24 },
  { name: 'PPE',                         dur: 24 },
  { name: 'Precautions',                 dur: 24 },
  { name: 'Bag Technique',               dur: 20 },
  { name: 'Sharps & Needlesticks',       dur: 26 },
  { name: 'Cleaning & Waste',            dur: 28 },
  { name: 'Firearms',                    dur: 27 },
  { name: 'Ch.4 The Work',               dur: 4  },
  { name: 'Personal Care Detail',        dur: 19 },
  { name: 'Skilled Nursing Detail',      dur: 23 },
  { name: 'Onboarding',                  dur: 21 },
  { name: 'Plan of Care',                dur: 25 },
  { name: 'Delegation',                  dur: 25 },
  { name: 'Documentation',               dur: 22 },
  { name: 'Advance Directives',          dur: 25 },
  { name: 'Controlled Substances',       dur: 28 },
  { name: 'Ch.5 People & Quality',       dur: 5  },
  { name: 'Governance',                  dur: 25 },
  { name: 'Personnel',                   dur: 22 },
  { name: 'Training',                    dur: 30 },
  { name: 'Dementia',                    dur: 29 },
  { name: 'Reporting',                   dur: 28 },
  { name: 'Reportable to DHHS',          dur: 26 },
  { name: 'Grievance',                   dur: 34 },
  { name: 'Discharge',                   dur: 27 },
  { name: 'Emergency Prep',              dur: 25 },
  { name: 'Records',                     dur: 26 },
  { name: 'Quality Assurance',           dur: 20 },
  { name: 'Recap',                       dur: 11 },
  { name: 'Acknowledgment',              dur: 60 },
];

let _t = 0;
const SCENE_TIMELINE = SCENES.map(s => { const start = _t; _t += s.dur; return { ...s, start }; });
const TOTAL_DURATION = _t;

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(msg) { process.stdout.write(`[render-video] ${msg}\n`); }

function startServer(dir) {
  const mimes = { '.html':'text/html', '.jsx':'application/javascript',
    '.js':'application/javascript', '.mp3':'audio/mpeg',
    '.json':'application/json', '.png':'image/png', '.txt':'text/plain' };
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(dir, rel === '/' ? 'NH Care Center Orientation.html' : rel);
    try {
      const data = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': mimes[path.extname(file)] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*' });
      res.end(data);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

// ── Step 1: Build narration audio track ───────────────────────────────────────
function buildAudio(outPath) {
  log('Building narration audio track…');

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH));
  const byName = {};
  for (const e of manifest) byName[e.key] = e;

  const inputs = [];
  const filterParts = [];
  const labels = [];

  for (let i = 0; i < SCENE_TIMELINE.length; i++) {
    const sc = SCENE_TIMELINE[i];
    const entry = byName[sc.name];
    if (!entry) { log(`  (no audio for scene: ${sc.name})`); continue; }
    const file = path.join(PROJECT_DIR, 'narration-audio', entry.file);
    if (!fs.existsSync(file)) { log(`  (missing file: ${entry.file})`); continue; }

    const delayMs = Math.round(sc.start * 1000);
    inputs.push(`-i`, file);
    const idx = inputs.length / 2 - 1;
    filterParts.push(`[${idx}]adelay=${delayMs}|${delayMs}[a${idx}]`);
    labels.push(`[a${idx}]`);
  }

  const n = labels.length;
  const filter = [...filterParts,
    `${labels.join('')}amix=inputs=${n}:duration=longest:normalize=0[out]`
  ].join(';');

  const args = [...inputs, '-filter_complex', filter, '-map', '[out]',
    '-ar', '44100', '-b:a', '128k', '-y', outPath];

  log(`  Mixing ${n} audio tracks (total duration ~${Math.round(TOTAL_DURATION/60)} min)…`);
  const result = spawnSync(FFMPEG, args, { stdio: 'inherit', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new Error('ffmpeg audio build failed');
  log('  Audio track ready: ' + outPath);
}

// ── Step 2: Capture video with Playwright ─────────────────────────────────────
async function captureVideo(videoOutPath) {
  const { server, port } = await startServer(PROJECT_DIR);
  log(`HTTP server on port ${port}`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nhcc-'));
  log(`Recording dir: ${tmpDir}`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--autoplay-policy=no-user-gesture-required',
    ],
    executablePath: path.join('/opt/pw-browsers/chromium-1194', 'chrome-linux', 'chrome'),
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: tmpDir, size: { width: 1920, height: 1080 } },
  });

  const page = await context.newPage();

  // The sandbox blocks unpkg.com; serve React/ReactDOM/Babel from vendor/ instead.
  // Hashes match the integrity= attributes in the HTML, so SRI still passes.
  const vendorMap = {
    'https://unpkg.com/react@18.3.1/umd/react.development.js':
      path.join(PROJECT_DIR, 'vendor', 'react.development.js'),
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js':
      path.join(PROJECT_DIR, 'vendor', 'react-dom.development.js'),
    'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':
      path.join(PROJECT_DIR, 'vendor', 'babel.min.js'),
  };
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const local = vendorMap[url];
    if (local) {
      route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(local) });
      return;
    }
    // Proxy Google Fonts through Node (curl works in-sandbox, browser TLS doesn't)
    if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url)) {
      try {
        const body = await new Promise((resolve, reject) => {
          https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
          }).on('error', reject);
        });
        const ct = url.includes('googleapis.com') ? 'text/css' : 'font/woff2';
        route.fulfill({ status: 200, contentType: ct, body });
      } catch { route.abort(); }
      return;
    }
    route.continue();
  });

  // Inject RAF speed multiplier so the animation runs SPEED_MULT× faster.
  // This halves (or reduces) the recording time; ffmpeg stretches it back.
  await page.addInitScript((mult) => {
    localStorage.clear();
    const _raf = window.requestAnimationFrame.bind(window);
    let _originReal = null;
    window.requestAnimationFrame = cb => _raf(realTs => {
      if (_originReal === null) _originReal = realTs;
      cb(_originReal + (realTs - _originReal) * mult);
    });
  }, SPEED_MULT);

  page.on('pageerror', err => log(`  [pageerror] ${err.message}`));

  log('Loading orientation page…');
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle', timeout: 60_000 });

  // Wait for Babel to finish compiling JSX and React to mount the app.
  log('Waiting for app to mount…');
  await page.waitForFunction(
    () => window.React && window.ReactDOM && document.getElementById('root')?.children?.length > 0,
    { timeout: 60_000 }
  );
  // Small extra buffer for fonts and any deferred work
  await page.waitForTimeout(2_000);

  log(`Starting animation (will run at ${SPEED_MULT}× speed)…`);
  await page.keyboard.press('Space');

  const recordingMs = Math.ceil(TOTAL_DURATION / SPEED_MULT) * 1000 + 6_000;
  log(`Waiting ${Math.round(recordingMs / 1000)}s for animation to finish…`);
  await page.waitForTimeout(recordingMs);

  log('Closing browser…');
  await context.close();
  await browser.close();
  server.close();

  // Move the recorded WebM to the output path
  const webms = fs.readdirSync(tmpDir).filter(f => f.endsWith('.webm'));
  if (webms.length === 0) throw new Error('Playwright produced no video file');
  fs.copyFileSync(path.join(tmpDir, webms[0]), videoOutPath);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  log('Raw video captured: ' + videoOutPath);
}

// ── Step 3: Slow video + merge audio ─────────────────────────────────────────
function mergeVideoAudio(rawVideoPath, audioPath, outPath) {
  log('Slowing video and merging audio…');

  // setpts=N*PTS stretches time by N (undoes the SPEED_MULT speedup).
  // fps=30 re-stamps frames at 30fps to avoid VFR weirdness.
  const args = [
    '-i', rawVideoPath,
    '-i', audioPath,
    '-filter:v', `setpts=${SPEED_MULT}.0*PTS,fps=fps=30`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-shortest',
    '-movflags', '+faststart',
    '-y', outPath,
  ];

  log('  Encoding MP4 (this may take a few minutes)…');
  const result = spawnSync(FFMPEG, args, { stdio: 'inherit', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new Error('ffmpeg merge failed');
  log('  MP4 ready: ' + outPath);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  log(`Total duration: ${TOTAL_DURATION}s (~${Math.round(TOTAL_DURATION / 60)} min)`);
  log(`Recording at ${SPEED_MULT}× → ~${Math.round(TOTAL_DURATION / SPEED_MULT / 60)} min recording time`);

  const tmpAudio = path.join(os.tmpdir(), 'nhcc-audio.mp3');
  const tmpVideo = path.join(os.tmpdir(), 'nhcc-raw.webm');

  try {
    buildAudio(tmpAudio);
    await captureVideo(tmpVideo);
    mergeVideoAudio(tmpVideo, tmpAudio, OUTPUT_PATH);

    const stat = fs.statSync(OUTPUT_PATH);
    log(`\nDone!  ${OUTPUT_PATH}  (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
  } finally {
    if (fs.existsSync(tmpAudio)) fs.unlinkSync(tmpAudio);
    if (fs.existsSync(tmpVideo)) fs.unlinkSync(tmpVideo);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
