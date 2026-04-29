// shell.jsx — cinematic shell for the orientation:
//   • ChapterRibbon — bottom timeline showing all chapters & sub-scenes
//   • NowPlaying    — top-left chapter / scene title plate
//   • ChapterStamp  — embossed roman-numeral seal (used inside ChapterCard)
//   • KeyboardHelp  — '?'-toggleable legend
//   • CompletionReveal — closing card after all scenes finish
//
// All read live from useTime() / SCENE_TIMELINE; no scene-content changes.

// ── Helpers ─────────────────────────────────────────────────
function chapterListFromTimeline(timeline) {
  // Returns: [{ num, title, color, start, end, scenes: [...] }]
  const chapters = [];
  let pre = null; // accumulator for scenes before any chapter (intro)
  for (const s of timeline) {
    if (s.chapter) {
      chapters.push({ ...s.chapter, start: s.start, end: s.end, scenes: [] });
    } else if (chapters.length === 0) {
      // pre-chapter scenes (Cold Open, Welcome, Who We Are, Mission)
      if (!pre) pre = { num: '0', title: 'Opening', color: '#8A6D3B', start: s.start, end: s.end, scenes: [], _pre: true };
      pre.scenes.push(s);
      pre.end = s.end;
    } else {
      const cur = chapters[chapters.length - 1];
      cur.scenes.push(s);
      cur.end = s.end;
    }
  }
  // Tail scenes (Recap, Acknowledgment) — attach to a coda chapter
  // Detect by looking for scenes after the last chapter end
  // Actually they'll have already been attached to the last chapter above —
  // but Recap/Acknowledgment feel like a coda. Pull them out:
  const last = chapters[chapters.length - 1];
  const codaNames = new Set(['Recap', 'Acknowledgment']);
  if (last) {
    const codaScenes = last.scenes.filter(s => codaNames.has(s.name));
    if (codaScenes.length) {
      last.scenes = last.scenes.filter(s => !codaNames.has(s.name));
      last.end = last.scenes.length ? last.scenes[last.scenes.length - 1].end : last.end;
      const coda = { num: '✦', title: 'Closing', color: '#8A6D3B', _coda: true,
        start: codaScenes[0].start,
        end: codaScenes[codaScenes.length - 1].end,
        scenes: codaScenes };
      chapters.push(coda);
    }
  }
  return pre ? [pre, ...chapters] : chapters;
}

// Format mm:ss
function fmtTime(t) {
  if (!Number.isFinite(t)) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── ChapterRibbon ─────────────────────────────────────────
function ChapterRibbon({ timeline, totalDuration }) {
  const time = useTime();
  const { duration } = useTimeline();
  const chapters = React.useMemo(() => chapterListFromTimeline(timeline), [timeline]);
  const total = totalDuration || duration;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '18px 36px 22px',
      background: 'linear-gradient(to top, rgba(31,45,61,0.55) 0%, rgba(31,45,61,0.0) 100%)',
      pointerEvents: 'none',
    }}>
      {/* Time + total */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#FAF4E6',
        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
        opacity: 0.75, marginBottom: 10,
      }}>
        <span>{fmtTime(time)}</span>
        <span style={{ opacity: 0.55 }}>NH Care Center · New Employee Orientation</span>
        <span>{fmtTime(total)}</span>
      </div>

      {/* Chapter segments */}
      <div style={{ display: 'flex', gap: 6, height: 22, alignItems: 'stretch' }}>
        {chapters.map((ch, i) => {
          const span = ch.end - ch.start;
          const localFrac = clamp((time - ch.start) / span, 0, 1);
          const isActive = time >= ch.start && time < ch.end;
          const isPast = time >= ch.end;
          return (
            <div key={i} style={{
              flex: span,
              position: 'relative',
              borderRadius: 6,
              overflow: 'hidden',
              background: 'rgba(250,244,230,0.18)',
              border: isActive ? `2px solid ${ch.color}` : '2px solid rgba(250,244,230,0.25)',
              boxShadow: isActive ? `0 0 20px ${ch.color}77` : 'none',
              transition: 'border-color 300ms, box-shadow 300ms',
            }}>
              {/* Fill */}
              <div style={{
                position: 'absolute', inset: 0,
                background: ch.color,
                opacity: isPast ? 0.88 : isActive ? 0.65 : 0,
                transformOrigin: 'left center',
                transform: `scaleX(${isPast ? 1 : isActive ? localFrac : 0})`,
                transition: 'opacity 200ms',
              }}/>
              {/* Sub-scene ticks */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {ch.scenes.map((s, j) => {
                  if (j === 0) return null;
                  const left = ((s.start - ch.start) / span) * 100;
                  return (
                    <div key={j} style={{
                      position: 'absolute', left: `${left}%`, top: 0, bottom: 0,
                      width: 1, background: 'rgba(250,244,230,0.45)',
                    }}/>
                  );
                })}
              </div>
              {/* Label */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 800,
                color: '#FAF4E6', letterSpacing: '0.18em', textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                opacity: isActive || isPast ? 1 : 0.7,
              }}>
                {ch._pre ? 'Intro' : ch._coda ? 'Close' : `Ch.${ch.num}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── NowPlaying ────────────────────────────────────────────
function NowPlaying({ timeline }) {
  const time = useTime();
  const cur = timeline.find(s => time >= s.start && time < s.end);
  const chapters = React.useMemo(() => chapterListFromTimeline(timeline), [timeline]);
  if (!cur) return null;
  const ch = chapters.find(c => time >= c.start && time < c.end);
  if (!ch) return null;
  // Hide the plate while a chapter card is showing — its title already screams
  if (cur.chapter) return null;

  // Fade in 0.4s after each scene starts
  const sceneT = time - cur.start;
  const opacity = clamp((sceneT - 0.3) / 0.6, 0, 1) * (1 - clamp((sceneT - (cur.end - cur.start - 0.4)) / 0.4, 0, 1));

  // Bottom-left, sitting just above the chapter ribbon so it never
  // collides with scene SectionHead titles at the top of each scene.
  return (
    <div style={{
      position: 'absolute', bottom: 92, left: 36,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '10px 18px 10px 14px',
      background: 'rgba(250,244,230,0.82)',
      backdropFilter: 'blur(8px)',
      border: '1.5px solid rgba(31,45,61,0.08)',
      borderRadius: 14,
      boxShadow: '0 6px 22px rgba(31,45,61,0.18)',
      opacity, transition: 'opacity 200ms',
      pointerEvents: 'none',
      maxWidth: 540,
    }}>
      {/* Color chip */}
      <div style={{
        width: 6, height: 44, borderRadius: 3,
        background: ch.color, boxShadow: `0 0 10px ${ch.color}55`,
        flexShrink: 0,
      }}/>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'Nunito, sans-serif', fontSize: 11,
          color: ch.color, letterSpacing: '0.28em', textTransform: 'uppercase',
          fontWeight: 800, marginBottom: 2, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {ch._pre ? 'Intro' : ch._coda ? 'Closing' : `Chapter ${ch.num} · ${ch.title}`}
        </div>
        <div style={{
          fontFamily: 'Fraunces, serif', fontSize: 22,
          color: '#1F2D3D', fontWeight: 600, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {cur.name.replace(/^Ch\.\d+\s+/, '')}
        </div>
      </div>
    </div>
  );
}

// ── ChapterStamp — large embossed seal (number + decorative ring) ──
function ChapterStamp({ num, color, t }) {
  // t: 0..1 progress within chapter card
  const ringProgress = clamp(t / 0.5, 0, 1);
  const numProgress = clamp((t - 0.25) / 0.5, 0, 1);
  // Ring "draws in" via stroke-dasharray
  const C_R = 110;
  const circumference = 2 * Math.PI * C_R;
  return (
    <svg width="280" height="280" viewBox="-140 -140 280 280" style={{
      filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.18))',
    }}>
      {/* Outer ring (drawing) */}
      <circle cx="0" cy="0" r={C_R} fill="none"
        stroke="rgba(250,244,230,0.92)" strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - ringProgress)}
        transform="rotate(-90)"/>
      {/* Inner ring */}
      <circle cx="0" cy="0" r="92" fill="none"
        stroke="rgba(250,244,230,0.45)" strokeWidth="1"
        opacity={ringProgress}/>
      {/* Tick marks around ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = 100, r2 = 105;
        return (
          <line key={i}
            x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
            stroke="rgba(250,244,230,0.7)" strokeWidth="2"
            opacity={ringProgress}/>
        );
      })}
      {/* Roman numeral / glyph */}
      <text x="0" y="2" textAnchor="middle" dominantBaseline="middle"
        fontFamily="Fraunces, serif" fontSize="100" fontWeight="500"
        fill="#FAF4E6" opacity={numProgress}
        style={{ transform: `scale(${0.7 + 0.3 * Easing.easeOutBack(numProgress)})`, transformOrigin: 'center' }}>
        {num}
      </text>
    </svg>
  );
}

// ── Polished ChapterCard (replaces the one in scenes.jsx) ──
function ChapterCardV2({ chapterNum, title, subtitle, color = '#4A86A8' }) {
  const { localTime, duration } = useSprite();
  const t = clamp(localTime / duration, 0, 1);
  const slide = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));
  const out = 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1);
  const underlineProgress = clamp((localTime - 0.7) / 0.8, 0, 1);
  const subtitleOpacity = clamp((localTime - 1.2) / 0.6, 0, 1);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: color,
      opacity: out, overflow: 'hidden',
    }}>
      {/* Soft texture: large diffuse circles */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id={`grad-${chapterNum}`} cx="0.2" cy="0.2" r="1">
            <stop offset="0" stopColor="#FAF4E6" stopOpacity="0.18"/>
            <stop offset="1" stopColor="#FAF4E6" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#grad-${chapterNum})`}/>
        <circle cx={W * 0.85} cy={H * 0.18} r="220" fill="#FAF4E6" opacity="0.10"/>
        <circle cx={W * 0.08} cy={H * 0.88} r="280" fill="#FAF4E6" opacity="0.08"/>
      </svg>

      {/* Layout: stamp (left) + text (right) */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: '440px 1fr', alignItems: 'center',
        padding: '0 140px',
        opacity: slide,
        transform: `translateX(${(1 - slide) * -40}px)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ChapterStamp num={chapterNum} color={color} t={t * (duration / 1.5)}/>
        </div>

        <div>
          <div style={{
            fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 800,
            color: '#FAF4E6', letterSpacing: '0.32em', textTransform: 'uppercase',
            opacity: 0.78, marginBottom: 28,
          }}>
            Chapter {chapterNum}
          </div>
          <div style={{
            fontFamily: 'Fraunces, serif', fontSize: 110, fontWeight: 600,
            color: '#FAF4E6', lineHeight: 1.02, letterSpacing: '-0.03em',
            maxWidth: 1200, textWrap: 'balance', position: 'relative',
            paddingBottom: 28,
          }}>
            {title}
            {/* Drawing underline */}
            <div style={{
              position: 'absolute', left: 0, bottom: 8,
              height: 4, width: `${underlineProgress * 220}px`,
              background: '#FAF4E6', opacity: 0.85, borderRadius: 2,
            }}/>
          </div>
          {subtitle && (
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontSize: 32,
              color: '#FAF4E6', opacity: subtitleOpacity * 0.85, marginTop: 36,
              maxWidth: 980, lineHeight: 1.4, textWrap: 'pretty', fontWeight: 400,
            }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Bottom flourish: thin rule + small label */}
      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 180,
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: subtitleOpacity * 0.7,
      }}>
        <div style={{ flex: 1, height: 1, background: '#FAF4E6', opacity: 0.4 }}/>
        <div style={{
          fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800,
          color: '#FAF4E6', letterSpacing: '0.4em', textTransform: 'uppercase',
          opacity: 0.85,
        }}>
          NHCC · Orientation
        </div>
        <div style={{ flex: 1, height: 1, background: '#FAF4E6', opacity: 0.4 }}/>
      </div>
    </div>
  );
}

// ── KeyboardHelp ───────────────────────────────────────────
function KeyboardHelp() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Subtle hint chip when closed
  return (
    <>
      <div style={{
        position: 'absolute', top: 28, right: 36,
        padding: '8px 14px',
        background: 'rgba(31,45,61,0.7)', color: '#FAF4E6',
        fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        borderRadius: 20, backdropFilter: 'blur(6px)',
        border: '1.5px solid rgba(250,244,230,0.18)',
        cursor: 'pointer', userSelect: 'none',
        whiteSpace: 'nowrap',
      }} onClick={() => setOpen(o => !o)}>
        Press ? for keys
      </div>
      {open && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(31,45,61,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, fontFamily: 'Nunito, sans-serif', color: '#FAF4E6',
        }} onClick={() => setOpen(false)}>
          <div style={{
            padding: 60, borderRadius: 16,
            background: 'rgba(31,45,61,0.6)',
            border: '1.5px solid rgba(250,244,230,0.18)',
            maxWidth: 720,
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              fontFamily: 'Fraunces, serif', fontSize: 42, fontWeight: 600,
              marginBottom: 8,
            }}>Keyboard shortcuts</div>
            <div style={{
              fontSize: 16, opacity: 0.7, marginBottom: 36, letterSpacing: '0.04em',
            }}>Navigate the orientation without leaving the keyboard.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 60, rowGap: 18, fontSize: 18 }}>
              {[
                ['Space', 'Play / pause'],
                ['← / →', 'Skip ±0.1s (Shift: ±1s)'],
                ['?', 'Toggle this help'],
                ['Esc', 'Close help'],
              ].map(([k, v], i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <kbd style={{
                      fontFamily: 'Nunito, monospace', fontSize: 14, fontWeight: 800,
                      padding: '6px 12px', borderRadius: 6,
                      background: 'rgba(250,244,230,0.15)',
                      border: '1.5px solid rgba(250,244,230,0.3)',
                      color: '#FAF4E6', letterSpacing: '0.05em',
                      minWidth: 64, textAlign: 'center',
                    }}>{k}</kbd>
                  </div>
                  <div style={{ alignSelf: 'center', opacity: 0.85 }}>{v}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── CompletionReveal — triggered when time near end ───────
// Placed inside the existing Acknowledgment scene window via a parallel layer.
function CompletionPulse({ totalDuration }) {
  const time = useTime();
  // Fire a subtle full-screen warm pulse over the last 4 seconds
  const t = clamp((time - (totalDuration - 4)) / 4, 0, 1);
  if (t <= 0) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `radial-gradient(circle at 50% 55%, rgba(208, 162, 76, ${0.22 * t}) 0%, rgba(208,162,76,0) 60%)`,
      mixBlendMode: 'multiply',
    }}/>
  );
}

Object.assign(window, {
  ChapterRibbon, NowPlaying, ChapterStamp, ChapterCardV2, KeyboardHelp, CompletionPulse,
  chapterListFromTimeline,
});
