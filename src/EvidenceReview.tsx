import { useState } from 'react'
import PilotMap from './PilotMap'
import { crowding, format, insufficient, numberValue, ratio, validReason, waitReduction } from './evidence'

const fields = [
  { key: 'wait', label: 'Average wait (minutes)', max: 1440, integer: false },
  { key: 'waitSamples', label: 'Wait observations', max: 1000000, integer: true },
  { key: 'trips', label: 'Observed trips / crowding sample size', max: 1000000, integer: true },
  { key: 'crowded', label: 'Crowded trips', max: 1000000, integer: true },
  { key: 'breakdowns', label: 'Breakdowns', max: 1000000, integer: true },
  { key: 'hazards', label: 'Independently verified hazards', max: 1000000, integer: true },
  { key: 'response', label: 'Mean response time (minutes)', max: 43200, integer: false },
  { key: 'responseSamples', label: 'Responded cases / response sample size', max: 1000000, integer: true },
  { key: 'unresolved', label: 'Unresolved cases', max: 1000000, integer: true },
  { key: 'falsePositives', label: 'False positives after human verification', max: 1000000, integer: true },
  { key: 'burden', label: 'Total driver participation hours', max: 1000000, integer: false },
  { key: 'drivers', label: 'Participating drivers (aggregate count)', max: 1000000, integer: true },
] as const
type Evidence = Record<(typeof fields)[number]['key'], string>
const initial: Evidence[] = [
  { wait: '20', waitSamples: '100', trips: '100', crowded: '48', breakdowns: '3', hazards: '2', response: '45', responseSamples: '4', unresolved: '2', falsePositives: '1', burden: '20', drivers: '10' },
  { wait: '17', waitSamples: '100', trips: '100', crowded: '39', breakdowns: '2', hazards: '3', response: '30', responseSamples: '5', unresolved: '1', falsePositives: '2', burden: '30', drivers: '10' },
]
const budgetLabels = ['Paid driver participation', 'Telemetry equipment', 'Connectivity', 'Independent hazard verification', 'Case review and closure', 'Contingency']
const money = (value: number | null) => value === null ? insufficient : `MXN $${format(value)}`

export default function EvidenceReview() {
  const [evidence, setEvidence] = useState(initial)
  const [budget, setBudget] = useState(['6000', '3000', '900', '2000', '1500', '1000'])
  const [decision, setDecision] = useState('')
  const [reason, setReason] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [saved, setSaved] = useState<{ decision: string; reason: string } | null>(null)
  const parsed = evidence.map(row => Object.fromEntries(fields.map(field => [field.key, numberValue(row[field.key], field.max, field.integer)])) as Record<keyof Evidence, number | null>)
  const waits = parsed.map(row => row.waitSamples !== null && row.waitSamples > 0 ? row.wait : null)
  const shares = parsed.map(row => crowding(row.crowded, row.trips))
  const reduction = waitReduction(waits[0], waits[1])
  const difference = shares[0] !== null && shares[1] !== null ? shares[0] - shares[1] : null
  const costs = budget.map(raw => numberValue(raw, 10000000))
  const total = costs.every(value => value !== null) ? costs.reduce<number>((sum, value) => sum + (value ?? 0), 0) : null
  const perTrip = ratio(total, parsed[1].trips)
  const reasonOk = validReason(reason)
  const decisionOk = ['Continue', 'Revise', 'Stop'].includes(decision)

  return <>
    <section className="metrics" aria-label="Sample outcomes">
      <article className="metric-card"><span className="eyebrow">AVERAGE WAIT · SAMPLE EVIDENCE</span>
        <strong>{waits.map(value => value === null ? insufficient : format(value)).join(' → ')} min</strong>
        <span>{reduction === null ? insufficient : `${format(Math.abs(reduction))}% ${reduction >= 0 ? 'less' : 'more'} waiting`}</span>
        <p>Proposed 15% wait target: {reduction === null ? insufficient : reduction >= 15 ? 'Met in sample data' : 'Not met in sample data'}. This is not an automatic decision.</p>
      </article>
      <article className="metric-card"><span className="eyebrow">CROWDED TRIPS · SAMPLE EVIDENCE</span>
        <strong>{shares.map(value => value === null ? insufficient : `${format(value)}%`).join(' → ')}</strong>
        <span>{difference === null ? insufficient : `${format(Math.abs(difference))} percentage points ${difference >= 0 ? 'lower' : 'higher'}`}</span>
        <p>Sample sizes: {parsed.map(row => row.trips === null ? insufficient : format(row.trips)).join(' → ')} trips. Reports do not prove fewer crashes.</p>
      </article>
      <article className="metric-card"><span className="eyebrow">EVIDENCE STATUS</span><strong>Sample only</strong><span className="metric-neutral">Local verification pending</span><p>Corridor, operator and participating drivers are unconfirmed. All entries below are invented aggregate examples, separate from ML.</p></article>
    </section>
    <PilotMap />
    <section className="principles" aria-labelledby="evidence-heading">
      <h2 id="evidence-heading">Editable aggregate evidence · Sample data</h2>
      <p>Unconfirmed three-stop Atizapán corridor · Morning peak, 08:00–09:00 local time, both windows. Real comparisons require matching sampling methods and verified coverage.</p>
      <p>Enter nonnegative numbers within the displayed limits; counts must be whole numbers. Blank fields mean missing evidence. No personal data.</p>
      <div className="evidence-grid">{evidence.map((row, index) => <fieldset key={index}>
        <legend>{index === 0 ? 'Baseline · 14 days' : 'Pilot · 30 days'} · Sample data</legend>
        {fields.map(field => {
          const value = parsed[index][field.key]
          const exceedsTrips = field.key === 'crowded' && value !== null && parsed[index].trips !== null && value > parsed[index].trips!
          const invalid = (row[field.key] !== '' && value === null) || exceedsTrips
          return <label key={field.key}>{field.label} <small>(0–{format(field.max)}{field.integer ? ', whole numbers' : ''})</small>
            <input type="number" min="0" max={field.max} step={field.integer ? '1' : 'any'} value={row[field.key]} aria-invalid={invalid} onChange={event => setEvidence(previous => previous.map((entry, i) => i === index ? { ...entry, [field.key]: event.target.value } : entry))} />
            {invalid ? <small className="error">{exceedsTrips ? 'Crowded trips cannot exceed observed trips.' : 'Enter a valid number within the stated range.'}</small> : value === null ? <small>{insufficient}</small> : null}
          </label>
        })}
        <p>Response time: {ratio(parsed[index].response, parsed[index].responseSamples) === null ? insufficient : `${format(parsed[index].response!)} minutes`}.</p>
        <p>Burden per participating driver: {ratio(parsed[index].burden, parsed[index].drivers) === null ? insufficient : `${format(ratio(parsed[index].burden, parsed[index].drivers)!)} hours`}.</p>
      </fieldset>)}</div>
      <p>Unresolved cases remain visible above. Conflicting reports and telemetry require human review, an assigned case owner, independent hazard verification and authority closure. Counts across 14 and 30 days are not directly comparable as rates.</p>
    </section>
    <section className="principles" aria-labelledby="budget-heading"><h2 id="budget-heading">Itemized pilot budget · Sample MXN costs</h2>
      <div className="budget-grid">{budget.map((raw, index) => <label key={budgetLabels[index]}>{budgetLabels[index]} (MXN, 0–10,000,000)
        <input type="number" min="0" max="10000000" step="any" value={raw} aria-invalid={raw !== '' && costs[index] === null} onChange={event => setBudget(previous => previous.map((value, i) => i === index ? event.target.value : value))} />
        {costs[index] === null && <small className="error">{raw === '' ? insufficient : 'Enter a valid nonnegative cost within the limit.'}</small>}
      </label>)}</div>
      <p><strong>Total: {money(total)}</strong> · Cost per observed pilot trip: {money(perTrip)}</p>
      <p>Payer unconfirmed. MX$2 fare increase and six-month extension are unapproved scenarios.</p>
    </section>
    <section className="principles" aria-labelledby="decision-heading"><h2 id="decision-heading">Human decision · Sample review</h2>
      <p>The reviewer weighs evidence, costs and driver burden. No automated dispatch, subsidy or penalty.</p>
      <form onSubmit={event => { event.preventDefault(); setAttempted(true); if (decisionOk && reasonOk) setSaved({ decision, reason: reason.trim() }) }} noValidate>
        <label>Decision<select value={decision} onChange={event => setDecision(event.target.value)} aria-invalid={attempted && !decisionOk}><option value="">Choose a human decision</option>{['Continue', 'Revise', 'Stop'].map(value => <option key={value}>{value}</option>)}</select></label>
        {attempted && !decisionOk && <p className="error">Choose Continue, Revise or Stop.</p>}
        <label>Reason (required, 10–500 characters after trimming; no personal data)<textarea value={reason} onChange={event => setReason(event.target.value)} aria-invalid={attempted && !reasonOk} rows={4} /></label>
        <small>{reason.trim().length} / 500 characters</small>
        {attempted && !reasonOk && <p className="error">Enter a reason of 10–500 characters. Whitespace alone does not count.</p>}
        <button type="submit">Record human decision</button>
      </form>
      {saved && <div role="status"><h3>Recorded sample decision: {saved.decision}</h3><p>{saved.reason}</p><p>This records the review at save time. Later evidence edits require a fresh review and save.</p></div>}
      <p>Edits and the recorded decision live only in React memory in this browser tab. Reloading clears them; nothing is sent or saved to a database.</p>
    </section>
  </>
}
