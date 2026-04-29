// scenes.jsx — Individual orientation scenes for NHCC video
// Each scene is a function that takes (sceneStart, sceneDuration) implicitly via Sprite wrappers.
// All animations driven by useSprite() / useTime() from the Stage starter.

const W = 1920,H = 1080;

// ── Helpers ──────────────────────────────────────────────────
function fadeIn(localTime, dur = 0.5) {return clamp(localTime / dur, 0, 1);}
function fadeOut(localTime, total, dur = 0.5) {return 1 - clamp((localTime - (total - dur)) / dur, 0, 1);}
function inOut(localTime, total, inDur = 0.5, outDur = 0.5) {
  return Math.min(fadeIn(localTime, inDur), fadeOut(localTime, total, outDur));
}

// Reusable scene background — soft cream paper, subtle dots
function CreamBg({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.paper, overflow: 'hidden' }}>
      <PaperBg width={W} height={H} />
      {children}
    </div>);

}

// Reusable chapter card (big colored block with a chapter title)
function ChapterCard({ chapterNum, title, subtitle, color = C.blue }) {
  const { localTime, duration, progress } = useSprite();
  const slide = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));
  const out = fadeOut(localTime, duration, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, background: color, opacity: out, overflow: 'hidden' }}>
      {/* Decorative circles */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={W * 0.85} cy={H * 0.2} r="180" fill={C.creamLight} opacity="0.15" />
        <circle cx={W * 0.1} cy={H * 0.85} r="240" fill={C.creamLight} opacity="0.12" />
        <circle cx={W * 0.7} cy={H * 0.8} r="120" fill={C.creamLight} opacity="0.18" />
      </svg>
      <div style={{
        position: 'absolute',
        left: 140,
        right: 140,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: slide,
        transform: `translateX(${(1 - slide) * -60}px)`
      }}>
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 32,
          fontWeight: 800,
          color: C.creamLight,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.7,
          marginBottom: 24
        }}>Chapter {chapterNum}</div>
        <div style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 110,
          fontWeight: 600,
          color: C.creamLight,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 1500,
          textWrap: 'balance'
        }}>{title}</div>
        {subtitle &&
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 34,
          color: C.creamLight,
          opacity: 0.85,
          marginTop: 36,
          maxWidth: 1200,
          lineHeight: 1.35,
          textWrap: 'pretty'
        }}>{subtitle}</div>
        }
      </div>
      {/* Page-corner illustration */}
      <svg width="280" height="280" viewBox="0 0 200 200" style={{ position: 'absolute', right: 120, bottom: 120, opacity: 0.95 }}>
        <Heart x={100} y={100} size={70} color={C.creamLight} stroke={C.creamLight} />
      </svg>
    </div>);

}

// ── 1. COLD OPEN — paper fade up + pen drawing logo ──
function Scene_ColdOpen() {
  const { localTime, duration } = useSprite();
  const f = inOut(localTime, duration, 0.6, 0.4);
  return (
    <CreamBg>
      <div style={{ position: 'absolute', inset: 0, opacity: f, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <img src="assets/nhcc-logo.png" style={{ width: 280, opacity: clamp((localTime - 0.3) / 0.8, 0, 1) }} />
        <div style={{
          fontFamily: 'Fraunces, serif', fontSize: 64, fontWeight: 500, color: C.blueDeep,
          marginTop: 48, opacity: clamp((localTime - 1.0) / 0.6, 0, 1),
          letterSpacing: '-0.02em'
        }}>NH Care Center</div>
        <div style={{
          fontFamily: 'Nunito, sans-serif', fontSize: 26, color: C.inkSoft,
          marginTop: 16, opacity: clamp((localTime - 1.4) / 0.6, 0, 1),
          letterSpacing: '0.32em', textTransform: 'uppercase'
        }}>New Employee Orientation</div>
      </div>
    </CreamBg>);

}

// ── 2. WELCOME ──
function Scene_Welcome() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      {/* House illustration */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g style={{ opacity: clamp((localTime - 0.2) / 0.6, 0, 1), transform: `translateY(${(1 - clamp((localTime - 0.2) / 0.6, 0, 1)) * 20}px)` }}>
          <HouseExterior x={W / 2} y={H * 0.6} size={2.4} />
        </g>
        {/* People walking up */}
        <g style={{ opacity: clamp((localTime - 0.8) / 0.5, 0, 1) }}>
          <Nurse x={W * 0.3} y={H * 0.7} size={1.4} scrub={C.blue} />
          <Person x={W * 0.7} y={H * 0.7} size={1.4} shirt={C.coral} hair="#5C4030" />
        </g>
        {/* Hearts floating */}
        {[0, 1, 2].map((i) => {
          const t = clamp((localTime - 1.2 - i * 0.2) / 1.5, 0, 1);
          return (
            <g key={i} style={{ opacity: t * (1 - t * 0.3) }}>
              <Heart x={W * 0.5 + (i - 1) * 80} y={H * 0.25 - t * 80} size={36 - i * 6} />
            </g>);

        })}
      </svg>
      <div style={{
        position: 'absolute', top: 120, left: 0, width: '100%', textAlign: 'center',
        opacity: clamp(localTime / 0.6, 0, 1) * fadeOut(localTime, duration, 0.6)
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 110, fontWeight: 500, color: C.blueDeep, letterSpacing: '-0.02em' }}>
          Welcome.
        </div>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 38, color: C.inkSoft, marginTop: 24, fontWeight: 500 }}>
          You're joining a team that brings care home.
        </div>
      </div>
    </CreamBg>);

}

// ── 3. WHO WE ARE — map of NH, address card ──
function Scene_WhoWeAre() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 100, left: 140, width: 900, opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Who we are</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 92, fontWeight: 500, color: C.blueDeep, marginTop: 20, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          A licensed home health agency serving New Hampshire.
        </div>
        <div style={{ fontFamily: 'Nunito', fontSize: 28, color: C.inkSoft, marginTop: 36, lineHeight: 1.5, opacity: clamp((localTime - 0.8) / 0.6, 0, 1) }}>
          Concord, NH · Comprehensive home health services<br />
          Licensed under <span style={{ fontWeight: 700 }}>NH RSA 151</span> and <span style={{ fontWeight: 700 }}>He-P 809</span><br />
          HIPAA Covered Entity
        </div>
      </div>
      {/* NH state silhouette + pin */}
      <svg width="600" height="700" viewBox="0 0 300 360" style={{ position: 'absolute', right: 140, top: 200, opacity: clamp((localTime - 0.4) / 0.6, 0, 1) }}>
        {/* Stylized NH */}
        <path d="M 80 20 L 220 30 L 240 80 L 250 160 L 230 240 L 200 320 L 130 340 L 90 280 L 70 180 L 60 90 Z"
        fill={C.bluePale} stroke={C.line} strokeWidth="2.5" strokeLinejoin="round" />
        <text x="150" y="120" textAnchor="middle" fill={C.blueDeep} fontFamily="Fraunces, serif" fontSize="28" fontWeight="600" opacity="0.5">New Hampshire</text>
        {/* Pin at Concord */}
        <g transform="translate(140, 200)" style={{ opacity: clamp((localTime - 1.2) / 0.5, 0, 1), transform: `translate(140px, ${200 - clamp((localTime - 1.2) / 0.5, 0, 1) * 20}px)` }}>
          <path d="M 0 0 Q -18 -10 -18 -28 Q -18 -46 0 -46 Q 18 -46 18 -28 Q 18 -10 0 0 Z" fill={C.coral} stroke={C.line} strokeWidth="2.5" />
          <circle cx="0" cy="-30" r="7" fill={C.creamLight} stroke={C.line} strokeWidth="1.8" />
        </g>
        <text x="195" y="200" fill={C.line} fontFamily="Nunito" fontWeight="700" fontSize="20">Concord</text>
      </svg>
    </CreamBg>);

}

// ── 4. MISSION ──
function Scene_Mission() {
  const { localTime, duration } = useSprite();
  const grow = Easing.easeOutBack(clamp(localTime / 0.8, 0, 1));
  return (
    <CreamBg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <svg width="280" height="280" viewBox="-100 -100 200 200" style={{ transform: `scale(${grow})`, width: "280px", height: "280px" }}>
          <Heart x={0} y={0} size={120} />
          <text x="0" y="38" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontFamily="Fraunces" fontSize="34" fontWeight="600" style={{ opacity: clamp((localTime - 0.7) / 0.4, 0, 1) }}>Care</text>
        </svg>
        <div style={{ marginTop: 60, textAlign: 'center', maxWidth: 1300, opacity: clamp((localTime - 1.0) / 0.5, 0, 1) }}>
          <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Our commitment</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 72, fontWeight: 500, color: C.blueDeep, marginTop: 24, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Every client deserves care that respects their <em style={{ color: C.coral }}>dignity</em>, <em style={{ color: C.coral }}>autonomy</em>, and <em style={{ color: C.coral }}>privacy</em>.
          </div>
        </div>
      </div>
    </CreamBg>);

}

// ── 5. TWO SERVICE TRACKS ──
function Scene_TwoTracks() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>What we provide</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 78, fontWeight: 500, color: C.blueDeep, marginTop: 16, letterSpacing: '-0.02em' }}>Two tracks of service.</div>
      </div>
      {/* Two cards */}
      <div style={{ position: 'absolute', top: 320, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 80 }}>
        {/* Skilled Nursing */}
        <div style={{
          width: 720, padding: 56,
          background: '#fff',
          borderRadius: 32,
          border: `3px solid ${C.line}`,
          boxShadow: `12px 12px 0 ${C.bluePale}`,
          opacity: clamp((localTime - 0.5) / 0.5, 0, 1),
          transform: `translateY(${(1 - clamp((localTime - 0.5) / 0.5, 0, 1)) * 30}px)`
        }}>
          <svg width="160" height="160" viewBox="-80 -80 160 160">
            <Stethoscope x={0} y={0} size={1.2} />
          </svg>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 56, fontWeight: 600, color: C.blueDeep, marginTop: 20 }}>Skilled Nursing</div>
          <div style={{ fontFamily: 'Nunito', fontSize: 26, color: C.inkSoft, marginTop: 24, lineHeight: 1.4 }}>
            RNs and LPNs delivering care under a <strong>physician's order</strong>.
          </div>
          <ul style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 24, lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Wound care, IV therapy, catheter care</li>
            <li>Medication management</li>
            <li>Tube feeding, chronic disease monitoring</li>
          </ul>
        </div>
        {/* Personal Care */}
        <div style={{
          width: 720, padding: 56,
          background: '#fff',
          borderRadius: 32,
          border: `3px solid ${C.line}`,
          boxShadow: `12px 12px 0 ${C.coralPale}`,
          opacity: clamp((localTime - 1.0) / 0.5, 0, 1),
          transform: `translateY(${(1 - clamp((localTime - 1.0) / 0.5, 0, 1)) * 30}px)`
        }}>
          <svg width="160" height="160" viewBox="-80 -80 160 160">
            <Heart x={0} y={0} size={90} />
          </svg>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 56, fontWeight: 600, color: C.blueDeep, marginTop: 20 }}>Personal Care</div>
          <div style={{ fontFamily: 'Nunito', fontSize: 26, color: C.inkSoft, marginTop: 24, lineHeight: 1.4 }}>
            HHAs, LNAs and PCAs supporting <strong>activities of daily living</strong>.
          </div>
          <ul style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 24, lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Bathing, dressing, toileting, mobility</li>
            <li>Meals, light housekeeping, errands</li>
            <li>Companionship, respite, escort</li>
          </ul>
        </div>
      </div>
    </CreamBg>);

}

// ── 6. PATIENT RIGHTS — animated 14 cards ──
const RIGHTS = [
['Respect & Dignity', 'Treated with consideration; privacy in care'],
['Non-Discrimination', 'Care without bias of any kind'],
['Plan of Care', 'Participate in your own care planning'],
['Quality of Care', 'Evaluated through Quality Assurance'],
['Refuse Treatment', 'Within the confines of the law'],
['Voice Grievances', 'Without fear of reprisal'],
['Freedom from Abuse', 'Emotional, physical, sexual, financial'],
['Freedom from Restraints', 'Except as physician-ordered'],
['Confidentiality', 'Of records and personal information'],
['Access to Records', 'Review your clinical record'],
['Financial Disclosure', 'In writing, in advance of care'],
['Advance Directives', 'Living Will, DPOA-HC honored'],
['Discharge Notice', 'Minimum 14 days written notice'],
['Legal Representative', 'Designate someone to assist you']];


function Scene_Rights() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>RSA 151:21-b</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 500, color: C.blueDeep, marginTop: 8, letterSpacing: '-0.02em' }}>
          The 14 Patient Rights
        </div>
      </div>
      <div style={{ position: 'absolute', top: 240, left: 100, right: 100, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
        {RIGHTS.map((r, i) => {
          const startT = 0.6 + i * 0.18;
          const t = clamp((localTime - startT) / 0.5, 0, 1);
          const eased = Easing.easeOutBack(t);
          const palette = [C.bluePale, C.coralPale, '#E0DFC9', '#D6E6F0'];
          return (
            <div key={i} style={{
              background: '#fff',
              border: `2.5px solid ${C.line}`,
              borderRadius: 18,
              padding: '22px 22px 22px 22px',
              minHeight: 160,
              opacity: t,
              transform: `scale(${0.7 + eased * 0.3}) rotate(${(i % 2 === 0 ? -1 : 1) * 0.7}deg)`,
              boxShadow: `5px 5px 0 ${palette[i % 4]}`
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: C.blue, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontWeight: 600, fontSize: 22,
                border: `2px solid ${C.line}`,
                marginBottom: 12
              }}>{i + 1}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, color: C.blueDeep, lineHeight: 1.2 }}>{r[0]}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 16, color: C.inkSoft, marginTop: 8, lineHeight: 1.35 }}>{r[1]}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 7. FREEDOM FROM ABUSE & RESTRAINTS ──
function Scene_FreedomFromAbuse() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: clamp(localTime / 0.4, 0, 1), textAlign: 'center', maxWidth: 1500 }}>
          <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>A bright line</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 88, fontWeight: 500, color: C.blueDeep, marginTop: 20, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Every client is <em style={{ color: C.coral }}>free from</em> abuse, exploitation, and restraint.
          </div>
        </div>
        <div style={{ marginTop: 70, display: 'flex', gap: 60, opacity: clamp((localTime - 0.6) / 0.5, 0, 1) }}>
          {['Emotional', 'Psychological', 'Sexual', 'Physical', 'Financial'].map((label, i) =>
          <div key={i} style={{ textAlign: 'center', transform: `translateY(${(1 - clamp((localTime - 0.6 - i * 0.1) / 0.4, 0, 1)) * 20}px)` }}>
              <svg width="100" height="100" viewBox="-50 -50 100 100">
                <XCircle x={0} y={0} size={80} />
              </svg>
              <div style={{ fontFamily: 'Nunito', fontSize: 22, fontWeight: 700, color: C.blueDeep, marginTop: 12 }}>{label}</div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 60, fontFamily: 'Nunito', fontSize: 26, color: C.inkSoft, opacity: clamp((localTime - 1.4) / 0.5, 0, 1), textAlign: 'center', maxWidth: 1400, lineHeight: 1.5 }}>
          Chemical and physical restraints are prohibited unless specifically authorized in writing by a physician.
        </div>
      </div>
    </CreamBg>);

}

// ── 8. HIPAA — uses & disclosures ──
function Scene_HIPAAUses() {
  const { localTime, duration } = useSprite();
  const items = [
  { label: 'Treatment', sub: 'Coordinating care among providers' },
  { label: 'Payment', sub: 'Billing Medicare, Medicaid, insurer' },
  { label: 'Operations', sub: 'Quality, training, audits' },
  { label: 'Required by Law', sub: 'Mandatory reports of abuse / disease' },
  { label: 'Public Health', sub: 'Reports to public health authorities' },
  { label: 'Care Helpers', sub: 'Family helping with care, unless objected' }];

  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>HIPAA · 45 CFR 160 & 164</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 78, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>When can we share PHI?</div>
        <div style={{ fontFamily: 'Nunito', fontSize: 26, color: C.inkSoft, marginTop: 16 }}>Six allowed uses without authorization.</div>
      </div>
      <div style={{ position: 'absolute', top: 340, left: 120, right: 120, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        {items.map((it, i) => {
          const t = clamp((localTime - 0.6 - i * 0.15) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 20, border: `2.5px solid ${C.line}`,
              padding: 32, opacity: t, transform: `translateY(${(1 - t) * 20}px)`,
              boxShadow: `6px 6px 0 ${C.bluePale}`
            }}>
              <svg width="60" height="60" viewBox="-30 -30 60 60">
                <CheckCircle x={0} y={0} size={50} />
              </svg>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: C.blueDeep, marginTop: 12 }}>{it.label}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 19, color: C.inkSoft, marginTop: 8, lineHeight: 1.4 }}>{it.sub}</div>
            </div>);

        })}
      </div>
      <div style={{ position: 'absolute', bottom: 70, left: 0, width: '100%', textAlign: 'center', opacity: clamp((localTime - 1.6) / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, fontStyle: 'italic' }}>
          All other uses require written patient authorization.
        </div>
      </div>
    </CreamBg>);

}

// ── 9. SENSITIVE INFO — heightened protection ──
function Scene_SensitiveInfo() {
  const { localTime, duration } = useSprite();
  const items = [
  { label: 'Substance Use', law: '42 CFR Part 2' },
  { label: 'HIV / AIDS', law: 'NH RSA 141-F' },
  { label: 'Mental Health', law: 'NH RSA 135-C:19-a' },
  { label: 'Genetic Info', law: 'GINA' },
  { label: 'Reproductive Care', law: 'Federal & NH law' }];

  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 100, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <svg width="160" height="160" viewBox="-80 -80 160 160" style={{ display: 'block', margin: '0 auto' }}>
          <Lock x={0} y={0} size={1.6} />
        </svg>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 72, fontWeight: 500, color: C.blueDeep, marginTop: 16, letterSpacing: '-0.02em' }}>Some records get extra protection.</div>
      </div>
      <div style={{ position: 'absolute', top: 530, left: 100, right: 100, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
        {items.map((it, i) => {
          const t = clamp((localTime - 0.7 - i * 0.18) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 16,
              padding: '24px 32px', opacity: t,
              transform: `translateY(${(1 - t) * 20}px)`,
              boxShadow: `4px 4px 0 ${C.coralPale}`,
              minWidth: 240
            }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: C.blueDeep }}>{it.label}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 16, color: C.coral, marginTop: 6, fontWeight: 600, letterSpacing: '0.05em' }}>{it.law}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 10. HAND HYGIENE — 5 MOMENTS ──
function Scene_HandHygiene() {
  const { localTime, duration } = useSprite();
  const moments = [
  'Before touching a patient',
  'Before clean/aseptic procedures',
  'After body fluid exposure risk',
  'After touching a patient',
  'After touching patient surroundings'];

  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>The single most important thing</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 88, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Hand hygiene.</div>
      </div>
      {/* Hand illustration in center with bubbles */}
      <svg width="500" height="500" viewBox="-150 -150 300 300" style={{ position: 'absolute', left: 200, top: 320, opacity: clamp((localTime - 0.4) / 0.5, 0, 1) }}>
        <Hand x={0} y={0} size={2.5} />
        {/* Bubbles */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const bt = clamp((localTime - 0.8) % 1.5 / 1.5, 0, 1);
          const angle = i * 60;
          const r = 60 + bt * 60;
          return <circle key={i} cx={Math.cos(angle * Math.PI / 180) * r} cy={Math.sin(angle * Math.PI / 180) * r - 30} r={6 - bt * 4} fill={C.bluePale} stroke={C.line} strokeWidth="1.5" opacity={1 - bt} />;
        })}
      </svg>
      {/* List of 5 moments */}
      <div style={{ position: 'absolute', top: 320, right: 140, width: 800 }}>
        {moments.map((m, i) => {
          const t = clamp((localTime - 0.8 - i * 0.25) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 24,
              marginBottom: 28, opacity: t,
              transform: `translateX(${(1 - t) * -30}px)`
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: C.coral, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontWeight: 600, fontSize: 32,
                border: `2.5px solid ${C.line}`, flexShrink: 0
              }}>{i + 1}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 30, color: C.blueDeep, fontWeight: 600 }}>{m}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 11. PPE ──
function Scene_PPE() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Point-of-Care Risk Assessment</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Choose the right PPE for the task.</div>
      </div>
      <div style={{ position: 'absolute', top: 330, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 80 }}>
        {[
        { name: 'Gloves', icon: 'glove', sub: 'Body fluids · non-intact skin · contaminated items' },
        { name: 'Gown', icon: 'gown', sub: 'When splashes or sprays are likely' },
        { name: 'Mask', icon: 'mask', sub: 'Respiratory secretions · droplets' },
        { name: 'Eye Shield', icon: 'eye', sub: 'When splashes near the face are possible' }].
        map((it, i) => {
          const t = clamp((localTime - 0.5 - i * 0.2) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              width: 360, padding: 36,
              background: '#fff', borderRadius: 22, border: `2.5px solid ${C.line}`,
              opacity: t, transform: `translateY(${(1 - t) * 30}px)`,
              boxShadow: `8px 8px 0 ${C.bluePale}`, textAlign: 'center'
            }}>
              <svg width="160" height="120" viewBox="-80 -60 160 120">
                {it.icon === 'glove' && <Glove x={0} y={0} />}
                {it.icon === 'mask' && <Mask x={0} y={0} />}
                {it.icon === 'gown' &&
                <g>
                    <path d="M -45 50 L -45 -10 Q -45 -30 -25 -35 L 0 -25 L 25 -35 Q 45 -30 45 -10 L 45 50 Z" fill={C.bluePale} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M -25 -35 L 0 -25 L 25 -35" stroke={C.line} strokeWidth="2" fill="none" />
                  </g>
                }
                {it.icon === 'eye' &&
                <g>
                    <path d="M -50 0 Q 0 -30 50 0 Q 50 20 0 20 Q -50 20 -50 0 Z" fill={C.bluePale} stroke={C.line} strokeWidth="2.2" strokeLinejoin="round" />
                    <ellipse cx="-22" cy="6" rx="14" ry="10" fill={C.creamLight} stroke={C.line} strokeWidth="1.8" />
                    <ellipse cx="22" cy="6" rx="14" ry="10" fill={C.creamLight} stroke={C.line} strokeWidth="1.8" />
                  </g>
                }
              </svg>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, color: C.blueDeep, marginTop: 12 }}>{it.name}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 18, color: C.inkSoft, marginTop: 12, lineHeight: 1.4 }}>{it.sub}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 12. TRANSMISSION-BASED PRECAUTIONS ──
function Scene_Precautions() {
  const { localTime, duration } = useSprite();
  const rows = [
  { title: 'Contact', color: '#D8533A', tag: 'Gown + Gloves', cases: 'MRSA · VRE · C. diff · Scabies' },
  { title: 'Droplet', color: C.gold, tag: 'Surgical Mask', cases: 'Influenza · Pertussis · Mumps' },
  { title: 'Airborne', color: C.blueDeep, tag: 'N95 Required', cases: 'TB · Measles · Chickenpox' }];

  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 80, fontWeight: 500, color: C.blueDeep, letterSpacing: '-0.02em' }}>Beyond standard precautions.</div>
      </div>
      <div style={{ position: 'absolute', top: 280, left: 200, right: 200 }}>
        {rows.map((r, i) => {
          const t = clamp((localTime - 0.5 - i * 0.3) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 40,
              padding: 40,
              background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 22,
              marginBottom: 24, opacity: t,
              transform: `translateX(${(1 - t) * -40}px)`,
              boxShadow: `6px 6px 0 ${r.color}`
            }}>
              <div style={{
                width: 140, height: 140, borderRadius: '50%',
                background: r.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontSize: 30, fontWeight: 600,
                border: `3px solid ${C.line}`, flexShrink: 0, lineHeight: 1.1, textAlign: 'center', padding: 10
              }}>{r.title}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 38, fontWeight: 600, color: C.blueDeep }}>{r.tag}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 6 }}>{r.cases}</div>
              </div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 13. BAG TECHNIQUE ──
function Scene_BagTechnique() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>In every home</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 80, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Bag Technique.</div>
      </div>
      {/* Big illustration: bag on table, barrier */}
      <svg width="900" height="600" viewBox="0 0 900 600" style={{ position: 'absolute', left: 100, top: 300, opacity: clamp((localTime - 0.3) / 0.5, 0, 1) }}>
        {/* Table */}
        <rect x="50" y="380" width="800" height="20" fill="#C9B895" stroke={C.line} strokeWidth="2.5" rx="4" />
        <line x1="80" y1="400" x2="80" y2="540" stroke={C.line} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="820" y1="400" x2="820" y2="540" stroke={C.line} strokeWidth="2.5" strokeLinecap="round" />
        {/* Barrier (paper) */}
        <rect x="280" y="350" width="380" height="40" fill="#fff" stroke={C.line} strokeWidth="2.2" rx="2" transform="rotate(-2 470 370)" />
        {/* Bag */}
        <g transform="translate(470, 240)">
          <rect x="-150" y="-60" width="300" height="180" fill={C.blue} stroke={C.line} strokeWidth="3" rx="14" />
          <rect x="-150" y="-60" width="300" height="40" fill={C.blueDeep} stroke={C.line} strokeWidth="3" rx="14" />
          <path d="M -90 -60 Q -90 -90 -50 -90 Q -50 -60 -50 -60" stroke={C.line} strokeWidth="3" fill="none" />
          <path d="M 90 -60 Q 90 -90 50 -90 Q 50 -60 50 -60" stroke={C.line} strokeWidth="3" fill="none" />
          <text x="0" y="50" textAnchor="middle" fontFamily="Fraunces" fontSize="36" fontWeight="600" fill="#fff">CLEAN ZONE</text>
        </g>
      </svg>
      {/* Rules */}
      <div style={{ position: 'absolute', right: 100, top: 320, width: 720 }}>
        {[
        'Place on a hard, clean, dry surface — never the floor.',
        'Always put a disposable barrier under the bag.',
        'Hand hygiene before opening.',
        'Inside is a CLEAN ZONE — used items never go back in.',
        'Close immediately after removing supplies.'].
        map((r, i) => {
          const t = clamp((localTime - 0.8 - i * 0.2) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 22,
              opacity: t, transform: `translateX(${(1 - t) * 30}px)`
            }}>
              <svg width="44" height="44" viewBox="-22 -22 44 44" style={{ flexShrink: 0 }}>
                <CheckCircle x={0} y={0} size={36} />
              </svg>
              <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.blueDeep, lineHeight: 1.4, fontWeight: 600 }}>{r}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 14. SHARPS / NEEDLESTICK ──
function Scene_Sharps() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 80, fontWeight: 500, color: C.blueDeep, letterSpacing: '-0.02em' }}>If a needlestick happens.</div>
      </div>
      <div style={{ position: 'absolute', left: 180, top: 320, opacity: clamp((localTime - 0.3) / 0.4, 0, 1) }}>
        <svg width="280" height="380" viewBox="-100 -100 200 280">
          <SharpsBin x={0} y={20} />
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 100, top: 280, width: 1100 }}>
        {[
        { n: '1', t: 'Wash & flush immediately', s: 'Soap and water; flush splashes; irrigate eyes with water/saline.' },
        { n: '2', t: 'Notify the Administrator', s: 'Call right away — do not wait until end of shift.' },
        { n: '3', t: 'Medical evaluation within 2 hours', s: 'For risk assessment and possible Post-Exposure Prophylaxis (PEP).' },
        { n: '4', t: 'Never recap a needle', s: 'Drop into a rigid, puncture-proof Sharps container immediately.' }].
        map((step, i) => {
          const t = clamp((localTime - 0.5 - i * 0.3) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', gap: 28, marginBottom: 28, alignItems: 'flex-start',
              opacity: t, transform: `translateX(${(1 - t) * 30}px)`
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: C.coral, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontSize: 32, fontWeight: 700,
                border: `2.5px solid ${C.line}`, flexShrink: 0
              }}>{step.n}</div>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 600, color: C.blueDeep }}>{step.t}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 6, lineHeight: 1.4 }}>{step.s}</div>
              </div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 15. ONBOARDING WORKFLOW ──
function Scene_Onboarding() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>From referral to start of care</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 70, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Onboarding workflow.</div>
      </div>
      <div style={{ position: 'absolute', top: 280, left: 100, right: 100 }}>
        {[
        ['1', 'Referral & Intake', 'Verify insurance, scope, capability'],
        ['2', "Physician's Orders", 'Required before skilled care begins'],
        ['3', 'Initial RN Assessment', 'Within 48 hours · head-to-toe'],
        ['4', 'Mandatory Disclosures', 'Bill of Rights · Advance Directives · Costs · Grievance'],
        ['5', 'Plan of Care', 'Developed by RN; physician signs off']].
        map(([n, t, s], i) => {
          const tt = clamp((localTime - 0.5 - i * 0.3) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', gap: 28, marginBottom: 24, alignItems: 'center',
              opacity: tt, transform: `translateX(${(1 - tt) * 40}px)`,
              padding: '28px 36px', background: '#fff', borderRadius: 18,
              border: `2.5px solid ${C.line}`, boxShadow: `5px 5px 0 ${i % 2 === 0 ? C.bluePale : C.coralPale}`
            }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%',
                background: i % 2 === 0 ? C.blue : C.coral, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontSize: 36, fontWeight: 700,
                border: `2.5px solid ${C.line}`, flexShrink: 0
              }}>{n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 600, color: C.blueDeep }}>{t}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 4 }}>{s}</div>
              </div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 16. PLAN OF CARE ──
function Scene_PlanOfCare() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 140, width: 1000, opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>He-P 809.15</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 84, fontWeight: 500, color: C.blueDeep, marginTop: 16, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Every patient has a written Plan of Care.
        </div>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, marginTop: 32, lineHeight: 1.6 }}>
          Built by the RN with the patient and physician.<br />
          Reviewed and re-signed at least every <strong>60 days</strong>.
        </div>
      </div>
      <div style={{ position: 'absolute', right: 140, top: 220, opacity: clamp((localTime - 0.4) / 0.5, 0, 1) }}>
        <svg width="400" height="500" viewBox="0 0 400 500">
          <Document x={0} y={0} w={360} h={460} title="PLAN OF CARE" lines={10} accent={C.blue} />
          {/* Stamp / signature */}
          <g transform="translate(280, 380)" style={{ opacity: clamp((localTime - 1.0) / 0.4, 0, 1) }}>
            <circle cx="0" cy="0" r="48" fill="none" stroke={C.coral} strokeWidth="3" strokeDasharray="3,2" />
            <text x="0" y="-2" textAnchor="middle" fill={C.coral} fontFamily="Fraunces" fontSize="11" fontWeight="700">PHYSICIAN</text>
            <text x="0" y="14" textAnchor="middle" fill={C.coral} fontFamily="Fraunces" fontSize="11" fontWeight="700">SIGNED</text>
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 140, top: 720, width: 1000, opacity: clamp((localTime - 0.8) / 0.5, 0, 1) }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['Diagnoses', 'Goals', 'Interventions', 'Frequency', 'Medications', 'Safety', 'Functional Limits'].map((tag, i) =>
          <div key={i} style={{
            padding: '12px 22px', background: C.bluePale, border: `2px solid ${C.line}`,
            borderRadius: 30, fontFamily: 'Nunito', fontSize: 20, fontWeight: 600, color: C.blueDeep
          }}>{tag}</div>
          )}
        </div>
      </div>
    </CreamBg>);

}

// ── 17. DELEGATION — what aides may / may not do ──
function Scene_Delegation() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Nursing Delegation · He-P 809.16</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 70, fontWeight: 500, color: C.blueDeep, marginTop: 12, letterSpacing: '-0.02em' }}>What aides may and may not do.</div>
      </div>
      <div style={{ position: 'absolute', top: 280, left: 100, right: 100, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        {/* MAY */}
        <div style={{
          background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 22, padding: 40,
          boxShadow: `8px 8px 0 ${C.bluePale}`,
          opacity: clamp((localTime - 0.4) / 0.5, 0, 1),
          transform: `translateY(${(1 - clamp((localTime - 0.4) / 0.5, 0, 1)) * 30}px)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="60" height="60" viewBox="-30 -30 60 60"><CheckCircle x={0} y={0} size={50} /></svg>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 600, color: C.sage }}>May (with delegation)</div>
          </div>
          <ul style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 24, lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Routine oral meds from a pre-filled pillbox</li>
            <li>Topical creams on intact skin</li>
            <li>Routine ostomy pouch emptying</li>
            <li>Vital signs</li>
          </ul>
        </div>
        {/* MAY NOT */}
        <div style={{
          background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 22, padding: 40,
          boxShadow: `8px 8px 0 ${C.coralPale}`,
          opacity: clamp((localTime - 0.8) / 0.5, 0, 1),
          transform: `translateY(${(1 - clamp((localTime - 0.8) / 0.5, 0, 1)) * 30}px)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="60" height="60" viewBox="-30 -30 60 60"><XCircle x={0} y={0} size={50} /></svg>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 600, color: '#D8533A' }}>May not (ever)</div>
          </div>
          <ul style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 24, lineHeight: 1.7, paddingLeft: 24 }}>
            <li>Injectable, IV, or feeding-tube meds</li>
            <li>Sterile procedures or sterile dressings</li>
            <li>Initial assessments or POC changes</li>
            <li>Tasks requiring nursing judgment</li>
          </ul>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 0, width: '100%', textAlign: 'center', opacity: clamp((localTime - 1.4) / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, fontStyle: 'italic' }}>
          Delegation is patient-specific and caregiver-specific. RN documents training and observes competency.
        </div>
      </div>
    </CreamBg>);

}

// ── 18. DOCUMENTATION ──
function Scene_Documentation() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 88, fontWeight: 500, color: C.blueDeep, letterSpacing: '-0.02em' }}>If it isn't documented…</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 88, fontWeight: 500, color: C.coral, marginTop: 12, fontStyle: 'italic', letterSpacing: '-0.02em' }}>it didn't happen.</div>
      </div>
      <div style={{ position: 'absolute', top: 380, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 34 }}>
        {[
        { t: 'Sign & date', s: 'Every entry, full signature' },
        { t: 'No back-fills', s: 'Late entries clearly marked' },
        { t: 'Single line-out', s: 'For corrections, then initial' },
        { t: 'No falsification', s: 'Strictly prohibited' },
        { t: 'HIPAA secure', s: 'Locked, encrypted, auditable' }].
        map((it, i) => {
          const t = clamp((localTime - 0.5 - i * 0.2) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              width: 280, padding: 28, background: '#fff', borderRadius: 18,
              border: `2.5px solid ${C.line}`, opacity: t,
              transform: `translateY(${(1 - t) * 30}px)`,
              boxShadow: `5px 5px 0 ${i % 2 === 0 ? C.bluePale : C.coralPale}`,
              textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: C.blueDeep }}>{it.t}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 18, color: C.inkSoft, marginTop: 10 }}>{it.s}</div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 19. TRAINING REQUIREMENTS ──
function Scene_Training() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 80, fontWeight: 500, color: C.blueDeep, letterSpacing: '-0.02em' }}>Your training journey.</div>
      </div>
      <div style={{ position: 'absolute', top: 280, left: 200, right: 200 }}>
        {[
        { tag: 'Day 1', title: 'General Orientation', sub: 'Policies · rights · infection control · emergencies — before any independent care' },
        { tag: 'First 90 days', title: '6 hrs Dementia Training', sub: 'RSA 151:47-51 · Communication · behaviors · safety · certificate to file' },
        { tag: 'Before patient contact', title: 'Health Screening + 2-Step TB', sub: 'Within 12 months · physical exam · TB Mantoux or IGRA' },
        { tag: 'Annually', title: '4 hrs Dementia + In-Service', sub: 'Bill of Rights · infection · emergencies · reporting · confidentiality' }].
        map((it, i) => {
          const t = clamp((localTime - 0.5 - i * 0.3) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              display: 'flex', gap: 32, alignItems: 'center', marginBottom: 28,
              opacity: t, transform: `translateX(${(1 - t) * 40}px)`,
              padding: '32px 40px', background: '#fff', borderRadius: 20,
              border: `2.5px solid ${C.line}`, boxShadow: `6px 6px 0 ${C.bluePale}`
            }}>
              <div style={{
                background: C.blueDeep, color: '#fff', padding: '14px 24px', borderRadius: 12,
                fontFamily: 'Nunito', fontSize: 18, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', flexShrink: 0, border: `2px solid ${C.line}`,
                minWidth: 220, textAlign: 'center'
              }}>{it.tag}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 600, color: C.blueDeep }}>{it.title}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 21, color: C.inkSoft, marginTop: 4 }}>{it.sub}</div>
              </div>
            </div>);

        })}
      </div>
    </CreamBg>);

}

// ── 20. MANDATORY REPORTING + GRIEVANCE ──
function Scene_Reporting() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>You see something. You say something.</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Mandatory reporting.</div>
      </div>
      <div style={{ position: 'absolute', top: 320, left: 100, right: 100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
        {[
        { name: 'NH Adult Protective Services', sub: 'Suspected abuse, neglect, exploitation', phone: '1-800-949-0470', tag: '24-hour hotline' },
        { name: 'NH DHHS Health Facilities', sub: 'Licensing complaints', phone: '(603) 271-9039 · 1-800-852-3345', tag: 'HFA-Licensing@dhhs.nh.gov' },
        { name: 'NH Long-Term Care Ombudsman', sub: 'Advocacy for long-term care clients', phone: '(603) 271-4375 · 1-800-442-5640', tag: 'OLTCO@dhhs.nh.gov' },
        { name: 'NHCC Administrator', sub: 'Mina Dhamala-Thatal', phone: '(603) 224-0036 · (603) 369-4880', tag: 'info@nhcarecenter.com' }].
        map((it, i) => {
          const t = clamp((localTime - 0.5 - i * 0.25) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              padding: 36, background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 20,
              opacity: t, transform: `translateY(${(1 - t) * 25}px)`,
              boxShadow: `6px 6px 0 ${i % 2 === 0 ? C.coralPale : C.bluePale}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <svg width="50" height="50" viewBox="-25 -25 50 50"><Phone x={0} y={0} size={1} /></svg>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: C.blueDeep }}>{it.name}</div>
              </div>
              <div style={{ fontFamily: 'Nunito', fontSize: 19, color: C.inkSoft, marginTop: 12 }}>{it.sub}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: C.coral, fontWeight: 600, marginTop: 14 }}>{it.phone}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 16, color: C.inkSoft, marginTop: 6, fontStyle: 'italic' }}>{it.tag}</div>
            </div>);

        })}
      </div>
      <div style={{ position: 'absolute', bottom: 50, left: 0, width: '100%', textAlign: 'center', opacity: clamp((localTime - 1.6) / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, fontStyle: 'italic' }}>
          No reprisal. Ever. Patients and staff are protected when they report in good faith.
        </div>
      </div>
    </CreamBg>);

}

// ── 21. EMERGENCY PREPAREDNESS ──
function Scene_Emergency() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>He-P 809.20</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>When the storm comes.</div>
      </div>
      {/* Triage levels */}
      <div style={{ position: 'absolute', top: 320, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 50 }}>
        {[
        { level: '1', label: 'Life-Sustaining', sub: 'Continuous care · vent, IV, hospice', color: '#D8533A' },
        { level: '2', label: 'Daily Essential', sub: 'Daily dependence · meds, wounds', color: C.gold },
        { level: '3', label: 'Routine', sub: 'Less frequent care · stable', color: C.sage }].
        map((it, i) => {
          const t = clamp((localTime - 0.4 - i * 0.25) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              width: 380, padding: 36,
              background: '#fff', borderRadius: 22, border: `2.5px solid ${C.line}`,
              opacity: t, transform: `translateY(${(1 - t) * 30}px)`,
              boxShadow: `8px 8px 0 ${it.color}`, textAlign: 'center'
            }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: it.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontSize: 56, fontWeight: 700,
                border: `3px solid ${C.line}`, margin: '0 auto'
              }}>{it.level}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 600, color: C.blueDeep, marginTop: 18 }}>{it.label}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 19, color: C.inkSoft, marginTop: 10, lineHeight: 1.4 }}>{it.sub}</div>
            </div>);

        })}
      </div>
      <div style={{ position: 'absolute', bottom: 100, left: 0, width: '100%', textAlign: 'center', opacity: clamp((localTime - 1.4) / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 26, color: C.blueDeep, fontWeight: 600, lineHeight: 1.5 }}>
          Every patient is triaged at admission so we know who to reach first<br />when services may be interrupted.
        </div>
      </div>
    </CreamBg>);

}

// ── 22. QUALITY ASSURANCE ──
function Scene_QA() {
  const { localTime, duration } = useSprite();
  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>QAPI · He-P 809.18</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>We measure how we care.</div>
      </div>
      {/* Cycle / loop illustration */}
      <svg width={W} height={500} style={{ position: 'absolute', top: 300, left: 0 }}>
        {/* Circle path */}
        <circle cx={W / 2} cy={250} r="180" fill="none" stroke={C.bluePale} strokeWidth="3" strokeDasharray="6,5" />
      </svg>
      {[
      { angle: -90, label: 'Plan', sub: 'Set quality indicators' },
      { angle: 0, label: 'Do', sub: 'Deliver care' },
      { angle: 90, label: 'Study', sub: 'Audit charts · review events' },
      { angle: 180, label: 'Act', sub: 'Improve · retrain · update' }].
      map((it, i) => {
        const cx = W / 2 + Math.cos(it.angle * Math.PI / 180) * 180;
        const cy = 550 + Math.sin(it.angle * Math.PI / 180) * 180;
        const t = clamp((localTime - 0.5 - i * 0.25) / 0.5, 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute', left: cx - 110, top: cy - 70,
            width: 220, textAlign: 'center', opacity: t,
            transform: `scale(${0.7 + t * 0.3})`
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: C.coral, color: '#fff', margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces', fontSize: 36, fontWeight: 600,
              border: `3px solid ${C.line}`
            }}>{it.label}</div>
            <div style={{ fontFamily: 'Nunito', fontSize: 20, color: C.inkSoft, marginTop: 12, fontWeight: 600 }}>{it.sub}</div>
          </div>);

      })}
      <div style={{ position: 'absolute', top: 720, left: 0, width: '100%', textAlign: 'center', opacity: clamp((localTime - 1.5) / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, color: C.blueDeep, fontStyle: 'italic' }}>
          Patient satisfaction surveys. Annual evaluation. Always improving.
        </div>
      </div>
    </CreamBg>);

}

// ── 23. ACKNOWLEDGMENT / SIGN-OFF (interactive) ──
function Scene_Acknowledgment({ onSigned }) {
  const { localTime, duration } = useSprite();
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [signed, setSigned] = React.useState(false);

  React.useEffect(() => {
    if (signed && onSigned) onSigned({ name, date });
  }, [signed]);

  return (
    <CreamBg>
      <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', textAlign: 'center', opacity: clamp(localTime / 0.5, 0, 1) }}>
        <div style={{ fontFamily: 'Nunito', fontSize: 24, color: C.coral, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>You made it.</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 92, fontWeight: 500, color: C.blueDeep, marginTop: 14, letterSpacing: '-0.02em' }}>Acknowledgment of Receipt.</div>
      </div>
      <div style={{
        position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
        width: 1100, padding: 60, background: '#fff', borderRadius: 28,
        border: `2.5px solid ${C.line}`, boxShadow: `12px 12px 0 ${C.bluePale}`,
        opacity: clamp((localTime - 0.5) / 0.6, 0, 1)
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: C.inkSoft, lineHeight: 1.55 }}>
          By signing below, I acknowledge that I have completed the NH Care Center new employee orientation and have received and reviewed the Home Care Clients' Bill of Rights, the HIPAA Privacy Notice, and the agency's Policies & Procedures. I understand my responsibilities for confidentiality, infection control, mandatory reporting, and patient safety.
        </div>
        {!signed ?
        <>
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontFamily: 'Nunito', fontSize: 18, color: C.inkSoft, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Print full name</label>
                <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: '100%', padding: '18px 22px', fontSize: 28,
                  fontFamily: 'Fraunces, serif',
                  border: `2.5px solid ${C.line}`, borderRadius: 12, background: C.creamLight, color: C.blueDeep,
                  outline: 'none'
                }} />
              
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontFamily: 'Nunito', fontSize: 18, color: C.inkSoft, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Date</label>
                <input
                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%', padding: '18px 22px', fontSize: 24,
                  fontFamily: 'Nunito',
                  border: `2.5px solid ${C.line}`, borderRadius: 12, background: C.creamLight, color: C.blueDeep,
                  outline: 'none'
                }} />
              
              </div>
            </div>
            <button
            onClick={() => name.trim() && setSigned(true)}
            disabled={!name.trim()}
            style={{
              marginTop: 40, padding: '22px 60px', fontSize: 28,
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              background: name.trim() ? C.coral : '#D0C8B6', color: '#fff',
              border: `2.5px solid ${C.line}`, borderRadius: 16,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              boxShadow: `5px 5px 0 ${C.line}`,
              letterSpacing: '0.02em'
            }}>
            
              Sign &amp; Acknowledge
            </button>
          </> :

        <div style={{ marginTop: 40, padding: 40, background: C.bluePale, borderRadius: 18, border: `2.5px dashed ${C.blueDeep}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <svg width="80" height="80" viewBox="-40 -40 80 80"><CheckCircle x={0} y={0} size={70} /></svg>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 42, color: C.blueDeep, fontWeight: 600 }}>Signed by {name}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 22, color: C.inkSoft, marginTop: 4 }}>on {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 18, color: C.coral, marginTop: 12, fontStyle: 'italic' }}>Welcome to NH Care Center.</div>
              </div>
            </div>
          </div>
        }
      </div>
    </CreamBg>);

}

Object.assign(window, {
  Scene_ColdOpen, Scene_Welcome, Scene_WhoWeAre, Scene_Mission,
  Scene_TwoTracks, Scene_Rights, Scene_FreedomFromAbuse,
  Scene_HIPAAUses, Scene_SensitiveInfo,
  Scene_HandHygiene, Scene_PPE, Scene_Precautions, Scene_BagTechnique, Scene_Sharps,
  Scene_Onboarding, Scene_PlanOfCare, Scene_Delegation, Scene_Documentation,
  Scene_Training, Scene_Reporting, Scene_Emergency, Scene_QA,
  Scene_Acknowledgment, ChapterCard, CreamBg
});