import PilotMap from './PilotMap'
import './App.css'

const sample = {
  baselineWait: 20,
  pilotWait: 17,
  baselineCrowding: 48,
  pilotCrowding: 39,
}

const waitChange =
  ((sample.baselineWait - sample.pilotWait) / sample.baselineWait) * 100
const crowdingChange =
  sample.baselineCrowding - sample.pilotCrowding

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div>
            <strong>Atizapán Transit Pilot</strong>
            <small>Passenger evidence · human decision</small>
          </div>
        </div>
        <span className="demo-badge">SIMULATED DATA · PUBLIC DEMO</span>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">WEEK 7 · OPERATOR REVIEW</span>
            <h1>Is this three-stop pilot worth continuing?</h1>
            <p>
              Compare passenger waiting, crowding and costs before an
              authorized transport reviewer makes a decision.
            </p>
          </div>
          <div className="hero-note">
            <strong>Decision stays with a person</strong>
            <span>
              This demo does not dispatch vehicles, approve fares or evaluate
              individual drivers.
            </span>
          </div>
        </section>

        <section className="timeline" aria-label="Pilot timeline">
          <div><strong>14 days</strong><span>Baseline window</span></div>
          <div className="timeline-arrow">→</div>
          <div><strong>30 days</strong><span>Proposed pilot window</span></div>
          <div className="timeline-arrow">→</div>
          <div><strong>Human review</strong><span>Continue · Revise · Stop</span></div>
        </section>

        <section className="metrics" aria-label="Sample outcomes">
          <article className="metric-card">
            <span className="eyebrow">AVERAGE WAIT · SAMPLE</span>
            <strong>{sample.baselineWait} → {sample.pilotWait} min</strong>
            <span className="metric-positive">{waitChange}% less waiting</span>
            <p>Illustrative baseline and pilot values. Target: at least 15%.</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">CROWDED TRIPS · SAMPLE</span>
            <strong>{sample.baselineCrowding}% → {sample.pilotCrowding}%</strong>
            <span className="metric-positive">
              {crowdingChange} percentage points lower
            </span>
            <p>Sample shares, not evidence of fewer crashes.</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">EVIDENCE STATUS</span>
            <strong>Sample only</strong>
            <span className="metric-neutral">Local verification pending</span>
            <p>Corridor, operator and participating drivers are unconfirmed.</p>
          </article>
        </section>

        <PilotMap />

        <section className="principles">
          <h2>Conditions before a real pilot</h2>
          <div className="principle-grid">
            <p><strong>Drivers:</strong> voluntary paid participation and a right to correct reports.</p>
            <p><strong>Safety:</strong> independent hazard verification and authority closure.</p>
            <p><strong>Privacy:</strong> route and time aggregates only; no individual scoring.</p>
            <p><strong>Shadow clause:</strong> no reuse of driver knowledge for surveillance or autonomous training without fresh worker approval, payment and income protection.</p>
          </div>
        </section>
      </main>

      <footer>Prototype for Valeria Karam · All displayed values are invented examples.</footer>
    </div>
  )
}

export default App
