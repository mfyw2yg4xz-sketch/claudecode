// scenes-extra.jsx — additional scenes covering policies not in scenes.jsx
// Topics: Governance & posting, Firearms, Service detail (Personal Care types),
// Skilled nursing detail, Personnel screening, Grievance, Discharge,
// Cleaning & biomedical waste, Advance Directives, Controlled Substances,
// Records (retention/ROI/closure), Reportable Incidents to DHHS.

const W2 = 1920, H2 = 1080;

function fadeIn2(localTime, dur = 0.5) { return clamp(localTime / dur, 0, 1); }
function fadeOut2(localTime, total, dur = 0.5) { return 1 - clamp((localTime - (total - dur)) / dur, 0, 1); }
function inOut2(localTime, total, inDur = 0.5, outDur = 0.5) {
  return Math.min(fadeIn2(localTime, inDur), fadeOut2(localTime, total, outDur));
}

// Reusable section title with sub-label
function SectionHead({ kicker, title, color = C.blue, x = 120, y = 100 }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, maxWidth: W2 - x*2 }}>
      <div style={{
        fontFamily: 'Nunito, sans-serif', fontSize: 22, fontWeight: 800,
        color: color, letterSpacing: '0.28em', textTransform: 'uppercase',
        opacity: 0.9, marginBottom: 14,
      }}>{kicker}</div>
      <div style={{
        fontFamily: 'Fraunces, serif', fontSize: 76, fontWeight: 600,
        color: C.ink, lineHeight: 1.05, letterSpacing: '-0.02em', textWrap: 'balance',
      }}>{title}</div>
    </div>
  );
}

// Reusable card
function PolicyCard({ x, y, w = 460, h = 280, title, body, accent = C.blue, icon, delay = 0 }) {
  const { localTime } = useSprite();
  const f = clamp((localTime - delay) / 0.5, 0, 1);
  const e = Easing.easeOutCubic(f);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 18,
      padding: 28, boxShadow: `5px 5px 0 ${accent}`,
      opacity: e, transform: `translateY(${(1-e)*20}px)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        {icon && <div style={{ width: 44, height: 44 }}>{icon}</div>}
        <div style={{
          fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: accent,
          letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>{title}</div>
      </div>
      <div style={{
        fontFamily: 'Nunito, sans-serif', fontSize: 19, color: C.ink,
        lineHeight: 1.45, textWrap: 'pretty',
      }}>{body}</div>
    </div>
  );
}

// ── GOVERNANCE & POSTING REQUIREMENTS ──────────────────────
function Scene_Governance() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 1 · Governance" title="The agency you work for." />
        <div style={{ position: 'absolute', left: 120, top: 320, fontFamily: 'Nunito', fontSize: 26, color: C.inkSoft, maxWidth: 1100, lineHeight: 1.5 }}>
          Licensed by the State of New Hampshire under <strong>He-P 809</strong> and <strong>RSA 151</strong>. Policies are reviewed every two years; you'll see them dated and signed.
        </div>

        <PolicyCard x={120} y={490} w={520} h={300} accent={C.blue} delay={0.3}
          title="Non-Discrimination"
          body="Care is provided regardless of race, color, religion, sex, national origin, age, marital status, sexual orientation, gender identity, disability, or source of payment. No exceptions."
        />
        <PolicyCard x={680} y={490} w={520} h={300} accent={C.sage} delay={0.6}
          title="Posted at Every Office"
          body="License, Patient Bill of Rights, HIPAA Notice, Grievance Procedure, Non-Smoking notice, and emergency contact numbers must be visibly posted."
        />
        <PolicyCard x={1240} y={490} w={520} h={300} accent={C.coral} delay={0.9}
          title="Records — Always Truthful"
          body="Falsifying any clinical, billing, or personnel record is grounds for immediate termination and may be reported to licensing boards. When in doubt, write a late entry — never alter."
        />
      </div>
    </CreamBg>
  );
}

// ── FIREARMS SAFETY ────────────────────────────────────────
function Scene_Firearms() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Section 5 · Safety" title="Firearms in the home." color={C.coral} />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 820 }}>
          <div style={{ fontFamily: 'Nunito', fontSize: 28, color: C.ink, lineHeight: 1.5, textWrap: 'pretty' }}>
            Many NH homes keep firearms. Our staff <strong>do not</strong> handle, store, clean, or move them — ever. If you see one in the work area, ask the client (or a family member) to secure it before care continues.
          </div>
          <div style={{
            marginTop: 36, padding: 28, background: '#FFF1ED',
            border: `2.5px solid ${C.coral}`, borderRadius: 16,
            fontFamily: 'Nunito', fontSize: 22, color: C.ink, lineHeight: 1.45,
          }}>
            <strong style={{ color: C.coral }}>If a client refuses to secure it</strong> and you feel unsafe, leave the home and call the on-call supervisor. Document the refusal. Your safety comes first.
          </div>
        </div>

        {/* Decorative warning sign */}
        <svg width="600" height="600" viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 280 }}>
          <Warning x={300} y={260} size={220}/>
          <text x="300" y="470" textAnchor="middle"
            fontFamily="Nunito" fontWeight="800" fontSize="34" letterSpacing="1" fill={C.ink}>
            STAFF DO NOT HANDLE
          </text>
          <text x="300" y="510" textAnchor="middle"
            fontFamily="Nunito" fontWeight="800" fontSize="34" letterSpacing="1" fill={C.ink}>
            FIREARMS
          </text>
        </svg>
      </div>
    </CreamBg>
  );
}

// ── PERSONAL CARE SERVICES — DETAIL ────────────────────────
function Scene_PersonalCareDetail() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  const items = [
    { t: 'Hygiene & Grooming', b: 'Bathing, dressing, oral care, toileting, skin care — preserve dignity, knock first, drape always.', accent: C.blue },
    { t: 'Household Support', b: 'Light housekeeping, laundry, meal prep, grocery runs — only inside the patient\'s living space.', accent: C.sage },
    { t: 'Companionship', b: 'Socialization, reading, walks, supervision — combat isolation, never substitute for skilled care.', accent: C.gold },
    { t: 'Mobility Support', b: 'Transfers, ambulation, range-of-motion. Use proper body mechanics; ask for a second person if unsafe.', accent: C.coral },
    { t: 'In-Home Respite', b: 'Short-term relief for family caregivers — your role is steady presence and routine.', accent: C.blueDeep },
    { t: 'What aides do NOT do', b: 'No injections, no wound care, no medication administration without RN delegation, no clinical assessment.', accent: '#7B3F3F' },
  ];

  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Section 8 · Non-Medical Services" title="What aides do — and don't." />
        <div style={{ position: 'absolute', left: 120, top: 320, display: 'grid', gridTemplateColumns: 'repeat(3, 540px)', gap: 30 }}>
          {items.map((it, i) => (
            <PolicyCard key={i} x={0} y={0} w={540} h={220}
              title={it.t} body={it.b} accent={it.accent} delay={0.2 + i*0.15}
            />
          )).map((card, i) => (
            <div key={i} style={{ position: 'relative' }}>{card}</div>
          ))}
        </div>
      </div>
    </CreamBg>
  );
}

// Simpler grid version (the .map().map() above is awkward — replacing)
function Scene_PersonalCareDetail2() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  const items = [
    { t: 'Hygiene & Grooming', b: 'Bathing, dressing, oral care, toileting, skin care — preserve dignity, knock first, drape always.', accent: C.blue },
    { t: 'Household Support', b: 'Light housekeeping, laundry, meal prep, grocery runs — only inside the patient\'s living space.', accent: C.sage },
    { t: 'Companionship', b: 'Socialization, reading, walks, supervision — combat isolation, never substitute for skilled care.', accent: C.gold },
    { t: 'Mobility Support', b: 'Transfers, ambulation, range-of-motion. Use proper body mechanics; ask for a second person if unsafe.', accent: C.coral },
    { t: 'In-Home Respite', b: 'Short-term relief for family caregivers — your role is steady presence and routine.', accent: C.blueDeep },
    { t: 'What aides do NOT do', b: 'No injections, no wound care, no medication administration without RN delegation, no clinical assessment.', accent: '#7B3F3F' },
  ];
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Section 8 · Non-Medical Services" title="What aides do — and don't." />
        {items.map((it, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return (
            <PolicyCard key={i}
              x={120 + col * 580} y={340 + row * 280}
              w={540} h={250}
              title={it.t} body={it.b} accent={it.accent} delay={0.2 + i*0.12}
            />
          );
        })}
      </div>
    </CreamBg>
  );
}

// ── SKILLED NURSING DETAIL ─────────────────────────────────
function Scene_SkilledNursingDetail() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  const items = [
    { t: 'Assessments & OASIS', b: 'Comprehensive admission assessment within 5 days. Recertification every 60 days while care continues.', accent: C.blue },
    { t: 'Medication Management', b: 'Reconciliation each visit; teach self-administration; report errors immediately. Follow He-P 809.16.', accent: C.coral },
    { t: 'Wounds & IV Therapy', b: 'Sterile technique for wound care, central lines, IV antibiotics. Only RNs perform advanced procedures.', accent: C.blueDeep },
    { t: 'Tube Feeding', b: 'Verify placement, check residuals per order, flush before/after, monitor for aspiration.', accent: C.sage },
    { t: 'Chronic Disease', b: 'Diabetes, CHF, COPD monitoring — vitals, weights, symptom tracking, patient teaching.', accent: C.gold },
    { t: 'Diabetic & Foot Care', b: 'Skin checks, blood glucose monitoring, insulin administration, foot inspection on every visit.', accent: '#7B3F3F' },
  ];
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Section 9 · Skilled Nursing" title="Nurses' clinical scope." />
        {items.map((it, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return (
            <PolicyCard key={i}
              x={120 + col * 580} y={340 + row * 280}
              w={540} h={250}
              title={it.t} body={it.b} accent={it.accent} delay={0.2 + i*0.12}
            />
          );
        })}
      </div>
    </CreamBg>
  );
}

// ── PERSONNEL SCREENING ────────────────────────────────────
function Scene_Personnel() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 2 · Personnel" title="Who we hire — and how." />
        <div style={{ position: 'absolute', left: 120, top: 320, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, maxWidth: 1100, lineHeight: 1.5 }}>
          Every direct-care employee passes the same gate before their first visit.
        </div>

        {[
          { t: 'Background Checks', b: 'Criminal record, NH BEAS Elder Abuse Registry, OIG/SAM exclusion lists. Re-checked every two years. He-P 809.17.', accent: C.blue },
          { t: 'Health Screening', b: 'TB test (2-step) on hire, then annual symptom screen. MMR, Tdap, influenza recommended. COVID per current guidance.', accent: C.sage },
          { t: 'License & Credentials', b: 'RN/LPN: active NH license. LNA: NH Board of Nursing registry. CPR/First Aid current. Verified at hire and renewal.', accent: C.coral },
          { t: 'Reference Checks', b: 'Two professional references contacted before offer. Documented in personnel file.', accent: C.blueDeep },
        ].map((it, i) => (
          <PolicyCard key={i}
            x={120 + (i % 2) * 880}
            y={420 + Math.floor(i / 2) * 280}
            w={840} h={250}
            title={it.t} body={it.b} accent={it.accent} delay={0.3 + i*0.15}
          />
        ))}
      </div>
    </CreamBg>
  );
}

// ── GRIEVANCE PROCEDURE (RSA 151:20) ──────────────────────
function Scene_Grievance() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 4 · Grievance" title="When a patient complains." />
        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          Patients have a right to complain — to us, or to the State — without fear of reprisal. Walk them through the steps. <strong>Do not</strong> discourage filing.
        </div>

        {/* Two-column layout */}
        <div style={{ position: 'absolute', left: 120, top: 470, width: 820, padding: 32, background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 18, boxShadow: `5px 5px 0 ${C.blue}` }}>
          <div style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 600, color: C.blue, marginBottom: 16 }}>1. With NH Care Center</div>
          <ol style={{ fontFamily: 'Nunito', fontSize: 20, color: C.ink, lineHeight: 1.55, paddingLeft: 24, margin: 0 }}>
            <li>Submit complaint to the Administrator (verbal or written).</li>
            <li>Investigation begins within <strong>5 business days</strong>.</li>
            <li>Written response within <strong>14 days</strong>.</li>
            <li>No retaliation — ever.</li>
          </ol>
        </div>

        <div style={{ position: 'absolute', left: 980, top: 470, width: 820, padding: 32, background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 18, boxShadow: `5px 5px 0 ${C.coral}` }}>
          <div style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 600, color: C.coral, marginBottom: 16 }}>2. With NH DHHS</div>
          <div style={{ fontFamily: 'Nunito', fontSize: 20, color: C.ink, lineHeight: 1.55 }}>
            <strong>Health Facilities Administration</strong><br/>
            Bureau of Licensing &amp; Certification<br/>
            129 Pleasant Street, Concord, NH 03301<br/>
            <span style={{ color: C.coral, fontWeight: 700 }}>(603) 271-9039</span> · <span style={{ fontFamily: 'monospace', fontSize: 18 }}>healthfacilities@dhhs.nh.gov</span>
          </div>
        </div>
      </div>
    </CreamBg>
  );
}

// ── DISCHARGE & TRANSFER ──────────────────────────────────
function Scene_Discharge() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 5.4 · Discharge" title="Ending care — properly." />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          Discharge is a clinical event, not a paperwork formality. RSA 151:21(V) and 151:26-a govern how — and when — we can stop.
        </div>

        {[
          { t: 'Valid Reasons', b: 'Goals met · patient moves out of service area · refuses care after counseling · safety threat to staff · non-payment after notice · physician order.', accent: C.blue },
          { t: 'Notice', b: 'At least 30 days written notice. Emergencies (immediate safety risk) — same-day notice with documentation.', accent: C.coral },
          { t: 'Right to Dispute', b: 'Patient may appeal to NH DHHS within the notice period. Care continues during appeal unless safety prevents it.', accent: C.blueDeep },
          { t: 'Discharge Plan', b: 'Written summary: clinical status, medications, equipment, follow-up providers, family education. Copy to patient + PCP.', accent: C.sage },
        ].map((it, i) => (
          <PolicyCard key={i}
            x={120 + (i % 2) * 880}
            y={420 + Math.floor(i / 2) * 280}
            w={840} h={250}
            title={it.t} body={it.b} accent={it.accent} delay={0.3 + i*0.15}
          />
        ))}
      </div>
    </CreamBg>
  );
}

// ── CLEANING & BIOMEDICAL WASTE ───────────────────────────
function Scene_CleaningWaste() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 7.4–7.6 · Cleaning &amp; Waste" title="What you carry out." color={C.sage} />

        {[
          { t: 'Equipment Cleaning', b: 'After every patient: clean visible soil, then disinfect with EPA-registered hospital-grade disinfectant. Allow full contact time.', accent: C.blue },
          { t: 'Single-Use Items', b: 'Tongue depressors, gloves, alcohol wipes — never reused, never carried to the next home.', accent: C.coral },
          { t: 'Soiled Linens', b: 'Bag at point of use. Don\'t shake. Transport in sealed bag — patient\'s laundry stays in the patient\'s home.', accent: C.gold },
          { t: 'Sharps Containers', b: 'Rigid, puncture-proof, fluid-tight, biohazard-labeled. Replace at ¾ full. Patient or agency disposal per arrangement.', accent: C.blueDeep },
          { t: 'Other Bio Waste', b: 'Saturated dressings, suction canisters → red bag. Solid waste in regular trash if double-bagged and not saturated.', accent: '#7B3F3F' },
          { t: 'Spills', b: 'Absorb with paper towels, clean, then disinfect (10% bleach for blood). Document, dispose of cleanup materials as bio waste.', accent: C.sage },
        ].map((it, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return (
            <PolicyCard key={i}
              x={120 + col * 580} y={340 + row * 280}
              w={540} h={250}
              title={it.t} body={it.b} accent={it.accent} delay={0.2 + i*0.12}
            />
          );
        })}
      </div>
    </CreamBg>
  );
}

// ── ADVANCE DIRECTIVES ────────────────────────────────────
function Scene_AdvanceDirectives() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 12 · Advance Directives" title="The patient's voice — even when they can't speak." color={C.blueDeep} />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          Every patient is asked at admission if they have a Living Will, Durable POA for Health Care, or POLST/MOLST form. We document, copy to the chart, and follow it.
        </div>

        {[
          { t: 'Ask at Admission', b: 'Standard admission question. If patient is uncertain, provide written information about their rights — never advise on content.', accent: C.blue },
          { t: 'Document & Copy', b: 'Place a copy in the clinical record. Note the existence (or absence) of each document type.', accent: C.sage },
          { t: 'Honor It', b: 'Plan of Care reflects the directive. DNR status communicated to all caregivers and EMS — wallet card, fridge envelope.', accent: C.coral },
          { t: 'Update', b: 'Re-ask at recertification. Patients may change directives at any time; old documents are voided in the chart.', accent: C.gold },
        ].map((it, i) => (
          <PolicyCard key={i}
            x={120 + (i % 2) * 880}
            y={420 + Math.floor(i / 2) * 280}
            w={840} h={250}
            title={it.t} body={it.b} accent={it.accent} delay={0.3 + i*0.15}
          />
        ))}
      </div>
    </CreamBg>
  );
}

// ── CONTROLLED SUBSTANCES ─────────────────────────────────
function Scene_Controlled() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 13 · Controlled Substances" title="Diversion is a felony." color={C.coral} />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          Patients trust us with opioids, benzodiazepines, and stimulants. Theft, tampering, or under-documenting is termination, license loss, and criminal prosecution.
        </div>

        {[
          { t: 'Count Every Visit', b: 'Skilled nursing: count and document on arrival and departure. Discrepancy = stop, call supervisor immediately.', accent: C.blueDeep },
          { t: 'Aides Don\'t Touch', b: 'Aides may remind a patient to take meds — but never handle, count, or transport controlled substances.', accent: C.coral },
          { t: 'Witnessed Waste', b: 'Disposal of partial doses requires a second-staff witness signature and is logged in the MAR.', accent: C.blue },
          { t: 'Suspicion = Report', b: 'If you suspect diversion (yours, a coworker\'s, or a family member\'s) — call the Administrator the same day. Confidential.', accent: C.gold },
        ].map((it, i) => (
          <PolicyCard key={i}
            x={120 + (i % 2) * 880}
            y={420 + Math.floor(i / 2) * 280}
            w={840} h={250}
            title={it.t} body={it.b} accent={it.accent} delay={0.3 + i*0.15}
          />
        ))}
      </div>
    </CreamBg>
  );
}

// ── RECORDS RETENTION / ROI / CLOSURE ────────────────────
function Scene_Records() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 10 · Clinical Records" title="What we keep, and for how long." />

        {[
          { t: 'Retention', b: 'Adult records: 7 years after discharge. Minor records: until age 21 OR 7 years, whichever is longer.', accent: C.blue },
          { t: 'Authentication', b: 'Every entry signed (name + credential + date + time). No pre-signing, no signing for someone else.', accent: C.sage },
          { t: 'Corrections', b: 'Single line through the error, write "error", initial and date. Never erase, never use white-out, never edit prior notes.', accent: C.coral },
          { t: 'Late Entries', b: 'Mark clearly as "late entry" with the date you\'re writing AND the date being documented. Explain the delay.', accent: C.gold },
          { t: 'Release of Info (ROI)', b: 'Written, signed authorization specifying recipient, purpose, dates, and what to release. Patient may revoke any time.', accent: C.blueDeep },
          { t: 'Agency Closure', b: 'If NH Care Center ever closes, patients receive 30-day notice and records are transferred per He-P 809.14(p).', accent: '#7B3F3F' },
        ].map((it, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return (
            <PolicyCard key={i}
              x={120 + col * 580} y={340 + row * 280}
              w={540} h={250}
              title={it.t} body={it.b} accent={it.accent} delay={0.2 + i*0.12}
            />
          );
        })}
      </div>
    </CreamBg>
  );
}

// ── REPORTABLE INCIDENTS to DHHS ─────────────────────────
function Scene_ReportableDHHS() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 11 · Reportable Incidents" title="Some events go straight to the State." color={C.coral} />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          The Administrator reports these to DHHS within the required timeframe. Your job is to tell the Administrator immediately.
        </div>

        <div style={{ position: 'absolute', left: 120, top: 460, width: 1680, padding: 32, background: '#fff', border: `2.5px solid ${C.line}`, borderRadius: 18, boxShadow: `5px 5px 0 ${C.coral}` }}>
          <div style={{ fontFamily: 'Fraunces', fontSize: 30, fontWeight: 600, color: C.coral, marginBottom: 18 }}>Report within 24 hours (or sooner)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontFamily: 'Nunito', fontSize: 21, color: C.ink, lineHeight: 1.5 }}>
            <div>• Patient death (unexpected, related to care)</div>
            <div>• Suspected abuse, neglect, or exploitation</div>
            <div>• Serious injury during care</div>
            <div>• Medication error with patient harm</div>
            <div>• Communicable disease outbreak</div>
            <div>• Loss or theft of patient PHI</div>
            <div>• Staff impairment on duty</div>
            <div>• Fire, evacuation, or property damage</div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 120, top: 880, width: 1680, padding: 24, background: '#FFF1ED', border: `2.5px solid ${C.coral}`, borderRadius: 14, fontFamily: 'Nunito', fontSize: 22, color: C.ink, textAlign: 'center' }}>
          When in doubt — <strong>tell your supervisor</strong>. Over-reporting is fine. Under-reporting is a violation.
        </div>
      </div>
    </CreamBg>
  );
}

// ── DEMENTIA & IN-SERVICE TRAINING (expansion) ───────────
function Scene_Dementia() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <SectionHead kicker="Part 2.5 · Dementia Training" title="Caring for clients with dementia." color={C.blueDeep} />

        <div style={{ position: 'absolute', left: 120, top: 320, width: 1700, fontFamily: 'Nunito', fontSize: 24, color: C.inkSoft, lineHeight: 1.5 }}>
          Required by NH RSA 151:47-51 — a separate, specialized curriculum every direct-care employee completes before serving a dementia client.
        </div>

        {[
          { t: 'What You\'ll Learn', b: 'Stages of dementia, behavioral expressions of unmet needs, validation therapy, redirection techniques, communication.', accent: C.blue },
          { t: 'When You\'ll Take It', b: 'Within your first 90 days. Annual refresher thereafter. Tracked in your personnel file.', accent: C.sage },
          { t: 'In Practice', b: 'Approach from the front. Speak slowly. Offer two choices, not many. Validate feelings before redirecting. Never argue with the reality they\'re in.', accent: C.coral },
          { t: 'Safety Signals', b: 'Wandering, sundowning, aggression, refusal of care — document and report patterns. Adjust the Plan of Care with the RN.', accent: C.gold },
        ].map((it, i) => (
          <PolicyCard key={i}
            x={120 + (i % 2) * 880}
            y={420 + Math.floor(i / 2) * 280}
            w={840} h={250}
            title={it.t} body={it.b} accent={it.accent} delay={0.3 + i*0.15}
          />
        ))}
      </div>
    </CreamBg>
  );
}

// ── CLOSING / RECAP before Acknowledgment ────────────────
function Scene_Recap() {
  const { localTime, duration } = useSprite();
  const f = inOut2(localTime, duration);
  const items = [
    { n: '1', t: 'Patient first.', d: 'Rights, dignity, voice — every visit.' },
    { n: '2', t: 'Privacy is protected.', d: 'PHI stays in the chart. HIPAA, always.' },
    { n: '3', t: 'Safety is shared.', d: 'Hand hygiene, PPE, bag technique, sharps.' },
    { n: '4', t: 'Care has a plan.', d: 'POC drives every visit. Document everything.' },
    { n: '5', t: 'Speak up.', d: 'Report concerns. Retaliation is forbidden.' },
  ];
  return (
    <CreamBg>
      <div style={{ opacity: f }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Caveat', fontSize: 48, color: C.coral }}>The five things you'll always remember</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 88, fontWeight: 600, color: C.ink, marginTop: 8, letterSpacing: '-0.02em' }}>Five anchors.</div>
        </div>

        {items.map((it, i) => {
          const f2 = clamp((localTime - 0.5 - i*0.3) / 0.6, 0, 1);
          const e = Easing.easeOutCubic(f2);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: 120 + i * 348,
              top: 440,
              width: 320, height: 420,
              opacity: e, transform: `translateY(${(1-e)*30}px)`,
              padding: 24,
              background: '#fff',
              border: `2.5px solid ${C.line}`, borderRadius: 18,
              boxShadow: `5px 5px 0 ${[C.blue, C.sage, C.coral, C.gold, C.blueDeep][i]}`,
            }}>
              <div style={{ fontFamily: 'Fraunces', fontSize: 84, fontWeight: 600, color: [C.blue, C.sage, C.coral, C.gold, C.blueDeep][i], lineHeight: 1, marginBottom: 16 }}>{it.n}</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 30, fontWeight: 600, color: C.ink, marginBottom: 12, lineHeight: 1.15 }}>{it.t}</div>
              <div style={{ fontFamily: 'Nunito', fontSize: 18, color: C.inkSoft, lineHeight: 1.45 }}>{it.d}</div>
            </div>
          );
        })}
      </div>
    </CreamBg>
  );
}

Object.assign(window, {
  Scene_Governance,
  Scene_Firearms,
  Scene_PersonalCareDetail: Scene_PersonalCareDetail2,
  Scene_SkilledNursingDetail,
  Scene_Personnel,
  Scene_Grievance,
  Scene_Discharge,
  Scene_CleaningWaste,
  Scene_AdvanceDirectives,
  Scene_Controlled,
  Scene_Records,
  Scene_ReportableDHHS,
  Scene_Dementia,
  Scene_Recap,
});
