// illustrations.jsx — Hand-drawn-feel SVG illustrations for NHCC orientation
// All original artwork, warm/rounded, healthcare-blue palette.

const C = {
  cream: '#F4ECDB',
  creamLight: '#FAF4E6',
  paper: '#FBF6EB',
  ink: '#1F2D3D',
  inkSoft: '#3A4A5E',
  blueDeep: '#2C5F7F',
  blue: '#4A86A8',
  blueLight: '#9EC5DD',
  bluePale: '#D6E6F0',
  coral: '#E08A6E',
  coralPale: '#F4C9B5',
  sage: '#9CAE8C',
  gold: '#D4A24C',
  line: '#2C3E50',
  shadow: 'rgba(44, 62, 80, 0.10)',
};

// Hand-drawn jiggle: tiny rotation + position offset for organic feel
function Jiggle({ children, amount = 1, seed = 0 }) {
  const rot = ((Math.sin(seed * 7.3) * 0.7) * amount).toFixed(2);
  const dx = ((Math.cos(seed * 4.1) * 1.2) * amount).toFixed(2);
  const dy = ((Math.sin(seed * 9.8) * 1.2) * amount).toFixed(2);
  return (
    <g transform={`translate(${dx}, ${dy}) rotate(${rot})`}>{children}</g>
  );
}

// A simple sketchy stroke wrapper
const SK = { stroke: C.line, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const SK_THIN = { ...SK, strokeWidth: 1.6 };

// ─── HOUSE WITH HEART (logo-inspired homage, original drawing) ───
function HouseHeart({ size = 200, x = 0, y = 0 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 200 156" style={{ position: 'absolute', left: x, top: y }}>
      {/* Heart background */}
      <path d="M100 145 C 30 100, 15 55, 50 35 C 75 22, 95 40, 100 55 C 105 40, 125 22, 150 35 C 185 55, 170 100, 100 145 Z"
        fill={C.bluePale} stroke={C.blue} strokeWidth="2.2" />
      {/* House body */}
      <path d="M55 130 L55 80 L100 45 L145 80 L145 130 Z"
        fill={C.creamLight} stroke={C.line} strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Roof */}
      <path d="M48 85 L100 42 L152 85" stroke={C.line} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      {/* Chimney */}
      <rect x="125" y="55" width="10" height="20" fill={C.blueDeep} stroke={C.line} strokeWidth="2"/>
      {/* Window frame */}
      <rect x="80" y="88" width="40" height="35" fill={C.bluePale} stroke={C.line} strokeWidth="2"/>
      <line x1="100" y1="88" x2="100" y2="123" stroke={C.line} strokeWidth="1.8"/>
      <line x1="80" y1="105" x2="120" y2="105" stroke={C.line} strokeWidth="1.8"/>
      {/* Ground line */}
      <path d="M30 145 Q 100 152 170 145" stroke={C.blue} strokeWidth="2.2" fill="none"/>
    </svg>
  );
}

// ─── PERSON (rounded, friendly) ───
function Person({ x = 0, y = 0, size = 1, skin = '#E8C7A8', shirt = C.blue, hair = '#3A2C20', pose = 'standing', eyes = 'happy' }) {
  const s = size;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Body / shirt */}
      <path d="M -28 100 Q -32 60 -22 50 L 22 50 Q 32 60 28 100 Z"
        fill={shirt} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* Neck */}
      <rect x="-8" y="38" width="16" height="14" fill={skin} stroke={C.line} strokeWidth="2"/>
      {/* Head */}
      <ellipse cx="0" cy="20" rx="22" ry="24" fill={skin} stroke={C.line} strokeWidth="2.2"/>
      {/* Hair */}
      <path d="M -22 12 Q -22 -8 0 -8 Q 22 -8 22 12 Q 18 0 0 0 Q -18 0 -22 12 Z"
        fill={hair} stroke={C.line} strokeWidth="2"/>
      {/* Eyes */}
      {eyes === 'happy' ? (
        <>
          <path d="M -10 20 Q -7 17 -4 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M 4 20 Q 7 17 10 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <circle cx="-7" cy="20" r="1.8" fill={C.line}/>
          <circle cx="7" cy="20" r="1.8" fill={C.line}/>
        </>
      )}
      {/* Smile */}
      <path d="M -6 28 Q 0 32 6 28" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="-13" cy="26" r="2.5" fill={C.coralPale} opacity="0.7"/>
      <circle cx="13" cy="26" r="2.5" fill={C.coralPale} opacity="0.7"/>
    </g>
  );
}

// ─── NURSE (with cap or stethoscope) ───
function Nurse({ x = 0, y = 0, size = 1, scrub = '#4A86A8' }) {
  const s = size;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Body */}
      <path d="M -30 105 Q -34 60 -24 50 L 24 50 Q 34 60 30 105 Z"
        fill={scrub} stroke={C.line} strokeWidth="2.2"/>
      {/* V-neck */}
      <path d="M -10 50 L 0 65 L 10 50" stroke={C.line} strokeWidth="2" fill="none"/>
      {/* Pocket */}
      <rect x="10" y="75" width="14" height="14" fill="none" stroke={C.line} strokeWidth="1.6" rx="1"/>
      {/* Neck */}
      <rect x="-8" y="38" width="16" height="14" fill="#E8C7A8" stroke={C.line} strokeWidth="2"/>
      {/* Head */}
      <ellipse cx="0" cy="20" rx="22" ry="24" fill="#E8C7A8" stroke={C.line} strokeWidth="2.2"/>
      {/* Hair tied back */}
      <path d="M -22 10 Q -22 -10 0 -10 Q 22 -10 22 10 L 18 5 Q 0 -2 -18 5 Z"
        fill="#5C4030" stroke={C.line} strokeWidth="2"/>
      {/* Eyes */}
      <path d="M -10 20 Q -7 17 -4 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 4 20 Q 7 17 10 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M -6 28 Q 0 32 6 28" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="-13" cy="26" r="2.5" fill={C.coralPale} opacity="0.7"/>
      <circle cx="13" cy="26" r="2.5" fill={C.coralPale} opacity="0.7"/>
      {/* Stethoscope */}
      <path d="M -16 55 Q -22 75 -10 80 Q 0 82 10 80 Q 22 75 16 55"
        stroke={C.line} strokeWidth="2.2" fill="none"/>
      <circle cx="0" cy="86" r="5" fill={C.gold} stroke={C.line} strokeWidth="2"/>
      {/* Cap with cross */}
      <path d="M -18 -2 L 18 -2 L 14 -10 L -14 -10 Z" fill="#fff" stroke={C.line} strokeWidth="2"/>
      <rect x="-2" y="-9" width="4" height="6" fill={C.coral}/>
      <rect x="-4" y="-7" width="8" height="2" fill={C.coral}/>
    </g>
  );
}

// ─── ELDERLY CLIENT (in chair / smiling) ───
function ElderlyClient({ x = 0, y = 0, size = 1 }) {
  const s = size;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Body */}
      <path d="M -28 100 Q -32 60 -22 50 L 22 50 Q 32 60 28 100 Z"
        fill={C.coral} stroke={C.line} strokeWidth="2.2"/>
      {/* Buttons */}
      <circle cx="0" cy="65" r="2" fill={C.line}/>
      <circle cx="0" cy="78" r="2" fill={C.line}/>
      <circle cx="0" cy="91" r="2" fill={C.line}/>
      {/* Neck */}
      <rect x="-7" y="38" width="14" height="14" fill="#E8C7A8" stroke={C.line} strokeWidth="2"/>
      {/* Head */}
      <ellipse cx="0" cy="20" rx="22" ry="24" fill="#E8C7A8" stroke={C.line} strokeWidth="2.2"/>
      {/* Gray hair */}
      <path d="M -22 12 Q -22 -8 0 -8 Q 22 -8 22 12 Q 18 0 0 0 Q -18 0 -22 12 Z"
        fill="#D8D2C5" stroke={C.line} strokeWidth="2"/>
      {/* Eyes — squinty/happy */}
      <path d="M -11 20 Q -7 16 -3 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 3 20 Q 7 16 11 20" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Glasses */}
      <circle cx="-7" cy="20" r="6" fill="none" stroke={C.line} strokeWidth="1.8"/>
      <circle cx="7" cy="20" r="6" fill="none" stroke={C.line} strokeWidth="1.8"/>
      <line x1="-1" y1="20" x2="1" y2="20" stroke={C.line} strokeWidth="1.8"/>
      {/* Smile */}
      <path d="M -6 30 Q 0 34 6 30" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Wrinkle near eyes */}
      <path d="M -16 16 L -19 14" stroke={C.line} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M 16 16 L 19 14" stroke={C.line} strokeWidth="1.4" strokeLinecap="round"/>
    </g>
  );
}

// ─── HEART (for compassion / care) ───
function Heart({ x = 0, y = 0, size = 60, color = C.coral, stroke = C.line }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={`M 0 ${size*0.85} C ${-size*0.95} ${size*0.4}, ${-size*0.95} ${-size*0.15}, ${-size*0.45} ${-size*0.15} C ${-size*0.2} ${-size*0.15}, 0 ${size*0.05}, 0 ${size*0.2} C 0 ${size*0.05}, ${size*0.2} ${-size*0.15}, ${size*0.45} ${-size*0.15} C ${size*0.95} ${-size*0.15}, ${size*0.95} ${size*0.4}, 0 ${size*0.85} Z`}
        fill={color} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"/>
    </g>
  );
}

// ─── HAND (hand washing / hand hygiene) ───
function Hand({ x = 0, y = 0, size = 1, mirror = false, color = '#E8C7A8' }) {
  const sx = mirror ? -size : size;
  return (
    <g transform={`translate(${x}, ${y}) scale(${sx}, ${size})`}>
      {/* Palm */}
      <path d="M -25 50 Q -28 20 -20 -10 Q -10 -25 0 -25 Q 10 -25 20 -10 Q 28 20 25 50 Z"
        fill={color} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
      {/* Fingers */}
      <path d="M -18 -8 Q -22 -28 -16 -32" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M -6 -18 Q -8 -38 -2 -42" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 6 -18 Q 8 -38 12 -40" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 16 -10 Q 22 -28 22 -32" stroke={C.line} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>
  );
}

// ─── DOCUMENT / CLIPBOARD ───
function Document({ x = 0, y = 0, w = 140, h = 180, lines = 6, title, accent = C.blue }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shadow */}
      <rect x="3" y="4" width={w} height={h} fill={C.shadow} rx="6"/>
      {/* Paper */}
      <rect x="0" y="0" width={w} height={h} fill="#fff" stroke={C.line} strokeWidth="2.2" rx="6"/>
      {/* Header bar */}
      <rect x="0" y="0" width={w} height="22" fill={accent} stroke={C.line} strokeWidth="2.2" rx="6"/>
      <rect x="0" y="14" width={w} height="8" fill={accent}/>
      {/* Title placeholder line */}
      {title ? (
        <text x={w/2} y="15" textAnchor="middle" fill="#fff" fontFamily="Nunito, sans-serif" fontSize="11" fontWeight="700">{title}</text>
      ) : null}
      {/* Body lines */}
      {Array.from({length: lines}).map((_, i) => {
        const yy = 38 + i * 18;
        const ww = (i % 3 === 2) ? w * 0.5 : w * 0.78;
        return <rect key={i} x="14" y={yy} width={ww} height="6" fill={C.bluePale} rx="3"/>;
      })}
    </g>
  );
}

// ─── SHIELD ───
function Shield({ x = 0, y = 0, size = 100, color = C.blue, label }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={`M 0 ${-size*0.5} L ${size*0.45} ${-size*0.35} L ${size*0.4} ${size*0.15} Q ${size*0.3} ${size*0.5} 0 ${size*0.6} Q ${-size*0.3} ${size*0.5} ${-size*0.4} ${size*0.15} L ${-size*0.45} ${-size*0.35} Z`}
        fill={color} stroke={C.line} strokeWidth="2.5" strokeLinejoin="round"/>
      {label === 'lock' && (
        <g transform={`translate(0, 0)`}>
          <rect x="-12" y="-2" width="24" height="20" rx="3" fill="#fff" stroke={C.line} strokeWidth="2"/>
          <path d="M -7 -2 L -7 -10 Q -7 -16 0 -16 Q 7 -16 7 -10 L 7 -2" stroke={C.line} strokeWidth="2.2" fill="none"/>
          <circle cx="0" cy="8" r="2" fill={C.line}/>
        </g>
      )}
      {label === 'check' && (
        <path d={`M ${-size*0.18} 0 L ${-size*0.05} ${size*0.18} L ${size*0.22} ${-size*0.18}`}
          stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </g>
  );
}

// ─── BANDAGE ICON ───
function Bandage({ x = 0, y = 0, size = 60 }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(-20)`}>
      <rect x={-size*0.55} y={-size*0.18} width={size*1.1} height={size*0.36} fill={C.coralPale} stroke={C.line} strokeWidth="2.2" rx="5"/>
      <rect x={-size*0.18} y={-size*0.18} width={size*0.36} height={size*0.36} fill={C.coral} stroke={C.line} strokeWidth="2.2" rx="3"/>
      {[-0.08, 0, 0.08].map((dx, i) => (
        <circle key={i} cx={dx*size} cy="0" r="1.5" fill={C.line}/>
      ))}
    </g>
  );
}

// ─── PILL BOTTLE ───
function PillBottle({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <rect x="-22" y="-30" width="44" height="14" fill="#fff" stroke={C.line} strokeWidth="2.2" rx="2"/>
      <rect x="-26" y="-20" width="52" height="60" fill={C.coral} stroke={C.line} strokeWidth="2.2" rx="4"/>
      <rect x="-22" y="-5" width="44" height="22" fill="#fff" stroke={C.line} strokeWidth="2"/>
      <line x1="-15" y1="2" x2="15" y2="2" stroke={C.line} strokeWidth="1.5"/>
      <line x1="-15" y1="9" x2="10" y2="9" stroke={C.line} strokeWidth="1.5"/>
      <text x="0" y="32" textAnchor="middle" fill="#fff" fontFamily="Nunito" fontSize="14" fontWeight="800">Rx</text>
    </g>
  );
}

// ─── CALENDAR ───
function Calendar({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <rect x="-40" y="-30" width="80" height="70" fill="#fff" stroke={C.line} strokeWidth="2.2" rx="5"/>
      <rect x="-40" y="-30" width="80" height="18" fill={C.blue} stroke={C.line} strokeWidth="2.2" rx="5"/>
      <rect x="-40" y="-18" width="80" height="6" fill={C.blue}/>
      <line x1="-25" y1="-38" x2="-25" y2="-22" stroke={C.line} strokeWidth="3" strokeLinecap="round"/>
      <line x1="25" y1="-38" x2="25" y2="-22" stroke={C.line} strokeWidth="3" strokeLinecap="round"/>
      {[0,1,2].map(r => [0,1,2,3,4].map(c => (
        <rect key={`${r}-${c}`} x={-34 + c*14} y={-6 + r*14} width="10" height="10" fill={C.bluePale} rx="1"/>
      )))}
      <rect x="-6" y="8" width="10" height="10" fill={C.coral} stroke={C.line} strokeWidth="2" rx="1"/>
    </g>
  );
}

// ─── SPEECH BUBBLE ───
function Bubble({ x = 0, y = 0, w = 220, h = 110, tail = 'bl', color = '#fff', children }) {
  const tailPath = tail === 'bl' ? `M 30 ${h} L 18 ${h+22} L 50 ${h}` : `M ${w-30} ${h} L ${w-18} ${h+22} L ${w-50} ${h}`;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width={w} height={h} fill={color} stroke={C.line} strokeWidth="2.2" rx="14"/>
      <path d={tailPath} fill={color} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
      <foreignObject x="14" y="10" width={w-28} height={h-20}>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, color: C.ink, lineHeight: 1.3 }}>
          {children}
        </div>
      </foreignObject>
    </g>
  );
}

// ─── STAR / SPARKLE ───
function Sparkle({ x, y, size = 12, color = C.gold }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={`M 0 ${-size} L ${size*0.3} ${-size*0.3} L ${size} 0 L ${size*0.3} ${size*0.3} L 0 ${size} L ${-size*0.3} ${size*0.3} L ${-size} 0 L ${-size*0.3} ${-size*0.3} Z`}
        fill={color} stroke={C.line} strokeWidth="1.4" strokeLinejoin="round"/>
    </g>
  );
}

// ─── LOCK ───
function Lock({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <rect x="-20" y="-5" width="40" height="32" fill={C.gold} stroke={C.line} strokeWidth="2.2" rx="4"/>
      <path d="M -12 -5 L -12 -16 Q -12 -28 0 -28 Q 12 -28 12 -16 L 12 -5" stroke={C.line} strokeWidth="2.5" fill="none"/>
      <circle cx="0" cy="9" r="3" fill={C.line}/>
      <rect x="-1.5" y="9" width="3" height="9" fill={C.line}/>
    </g>
  );
}

// ─── BIOHAZARD / SHARPS BIN ───
function SharpsBin({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-30" y="-40" width="60" height="14" fill="#fff" stroke={C.line} strokeWidth="2.2" rx="2"/>
      <line x1="-20" y1="-33" x2="20" y2="-33" stroke={C.line} strokeWidth="1.6"/>
      <rect x="-34" y="-30" width="68" height="76" fill="#D8533A" stroke={C.line} strokeWidth="2.2" rx="4"/>
      <text x="0" y="-2" textAnchor="middle" fill="#fff" fontFamily="Nunito" fontSize="13" fontWeight="800">SHARPS</text>
      <text x="0" y="28" textAnchor="middle" fill="#fff" fontFamily="Nunito" fontSize="11" fontWeight="700">BIOHAZARD</text>
    </g>
  );
}

// ─── HOUSE EXTERIOR ───
function HouseExterior({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <path d="M -90 50 L -90 -10 L 0 -70 L 90 -10 L 90 50 Z" fill={C.creamLight} stroke={C.line} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M -100 -5 L 0 -75 L 100 -5" stroke={C.line} strokeWidth="2.5" fill={C.coral} strokeLinejoin="round"/>
      <rect x="-15" y="10" width="30" height="40" fill={C.blueDeep} stroke={C.line} strokeWidth="2"/>
      <circle cx="9" cy="30" r="1.5" fill={C.gold}/>
      <rect x="-65" y="-5" width="30" height="25" fill={C.bluePale} stroke={C.line} strokeWidth="2"/>
      <line x1="-50" y1="-5" x2="-50" y2="20" stroke={C.line} strokeWidth="1.6"/>
      <line x1="-65" y1="7.5" x2="-35" y2="7.5" stroke={C.line} strokeWidth="1.6"/>
      <rect x="35" y="-5" width="30" height="25" fill={C.bluePale} stroke={C.line} strokeWidth="2"/>
      <line x1="50" y1="-5" x2="50" y2="20" stroke={C.line} strokeWidth="1.6"/>
      <line x1="35" y1="7.5" x2="65" y2="7.5" stroke={C.line} strokeWidth="1.6"/>
      <rect x="20" y="-30" width="14" height="20" fill={C.blueDeep} stroke={C.line} strokeWidth="2"/>
      <path d="M -120 50 Q 0 56 120 50" stroke={C.sage} strokeWidth="3" fill="none"/>
      {/* Trees */}
      <ellipse cx="-130" cy="40" rx="18" ry="22" fill={C.sage} stroke={C.line} strokeWidth="2"/>
      <rect x="-133" y="50" width="6" height="14" fill="#6B4A30" stroke={C.line} strokeWidth="1.8"/>
    </g>
  );
}

// ─── CHECKMARK CIRCLE ───
function CheckCircle({ x = 0, y = 0, size = 40, color = C.sage }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r={size/2} fill={color} stroke={C.line} strokeWidth="2.2"/>
      <path d={`M ${-size*0.2} 0 L ${-size*0.05} ${size*0.18} L ${size*0.22} ${-size*0.16}`}
        stroke="#fff" strokeWidth={size*0.12} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );
}

// ─── X CIRCLE ───
function XCircle({ x = 0, y = 0, size = 40, color = '#D8533A' }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r={size/2} fill={color} stroke={C.line} strokeWidth="2.2"/>
      <line x1={-size*0.2} y1={-size*0.2} x2={size*0.2} y2={size*0.2} stroke="#fff" strokeWidth={size*0.12} strokeLinecap="round"/>
      <line x1={-size*0.2} y1={size*0.2} x2={size*0.2} y2={-size*0.2} stroke="#fff" strokeWidth={size*0.12} strokeLinecap="round"/>
    </g>
  );
}

// ─── STETHOSCOPE STANDALONE ───
function Stethoscope({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <path d="M -40 -40 Q -50 0 -30 30 Q -10 50 0 30" stroke={C.line} strokeWidth="3" fill="none"/>
      <path d="M 40 -40 Q 50 0 30 30 Q 10 50 0 30" stroke={C.line} strokeWidth="3" fill="none"/>
      <circle cx="-40" cy="-42" r="5" fill={C.gold} stroke={C.line} strokeWidth="2"/>
      <circle cx="40" cy="-42" r="5" fill={C.gold} stroke={C.line} strokeWidth="2"/>
      <circle cx="0" cy="36" r="14" fill={C.blue} stroke={C.line} strokeWidth="2.5"/>
      <circle cx="0" cy="36" r="8" fill={C.bluePale} stroke={C.line} strokeWidth="1.8"/>
    </g>
  );
}

// ─── PPE: MASK ───
function Mask({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -40 -10 Q 0 -25 40 -10 L 40 15 Q 0 30 -40 15 Z" fill={C.bluePale} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
      <line x1="-40" y1="-2" x2="40" y2="-2" stroke={C.line} strokeWidth="1.5"/>
      <line x1="-40" y1="6" x2="40" y2="6" stroke={C.line} strokeWidth="1.5"/>
      <path d="M -40 -10 Q -55 -5 -55 5" stroke={C.line} strokeWidth="2" fill="none"/>
      <path d="M 40 -10 Q 55 -5 55 5" stroke={C.line} strokeWidth="2" fill="none"/>
    </g>
  );
}

// ─── GLOVES ───
function Glove({ x = 0, y = 0, color = C.bluePale, mirror = false }) {
  const sx = mirror ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${sx}, 1)`}>
      <path d="M -20 30 L -20 -10 Q -20 -30 -10 -30 L -8 -38 Q -3 -42 -1 -38 L -1 -28 Q 4 -32 8 -28 L 8 -22 Q 13 -26 16 -22 L 16 -8 Q 22 -8 22 0 L 22 30 Z"
        fill={color} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
      <line x1="-20" y1="22" x2="22" y2="22" stroke={C.line} strokeWidth="1.6"/>
    </g>
  );
}

// ─── WARNING TRIANGLE ───
function Warning({ x = 0, y = 0, size = 40 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={`M 0 ${-size*0.6} L ${size*0.6} ${size*0.5} L ${-size*0.6} ${size*0.5} Z`}
        fill={C.gold} stroke={C.line} strokeWidth="2.5" strokeLinejoin="round"/>
      <text x="0" y={size*0.2} textAnchor="middle" fill={C.line} fontFamily="Nunito" fontWeight="900" fontSize={size*0.7}>!</text>
    </g>
  );
}

// ─── CALL ICON / PHONE ───
function Phone({ x = 0, y = 0, size = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`}>
      <path d="M -18 -22 Q -22 -30 -14 -32 L -8 -28 Q -4 -22 -10 -16 Q -8 -2 4 6 Q 18 12 22 8 L 28 14 Q 32 22 24 26 Q 8 30 -10 18 Q -22 6 -18 -22 Z"
        fill={C.blue} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round"/>
    </g>
  );
}

// ─── FLOATING DECOR (paper background dots) ───
function PaperBg({ width = 1280, height = 720 }) {
  const dots = [];
  for (let i = 0; i < 60; i++) {
    const x = (i * 137) % width;
    const y = (i * 193) % height;
    dots.push(<circle key={i} cx={x} cy={y} r="1.4" fill={C.blue} opacity="0.08" />);
  }
  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      {dots}
    </svg>
  );
}

Object.assign(window, {
  C, Jiggle, SK, SK_THIN,
  HouseHeart, Person, Nurse, ElderlyClient, Heart, Hand,
  Document, Shield, Bandage, PillBottle, Calendar, Bubble,
  Sparkle, Lock, SharpsBin, HouseExterior, CheckCircle, XCircle,
  Stethoscope, Mask, Glove, Warning, Phone, PaperBg,
});
