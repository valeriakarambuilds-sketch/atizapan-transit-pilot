# Week 7 implementation prompt — Valeria

Read docs/PACKET.md before editing source code. Build only Valeria's declared pilot decision dashboard. Keep all visible demo data labeled "Simulated" or "Sample data".

Build in small, reviewable stages:

1. Dashboard shell: responsive English interface with pilot status, 14-day baseline, 30-day pilot, three-stop Atizapan map area, wait/crowding comparison, budget, and human decision area. No ride-hailing features.
2. Geodata and telemetry: use Leaflet/OpenStreetMap for three placeholder stop coordinates and a simulated vehicle with GPS, timestamp and speed. Label the route and telemetry as unconfirmed/simulated. Show a useful fallback if map tiles fail.
3. ML: train a small regression model locally on invented time-slot and vehicle-speed observations. Display its wait estimate and a clear "Simulated ML estimate" label separately from measured baseline/pilot inputs. Do not claim real-world accuracy.
4. Evidence and budget: editable validated inputs for wait, crowded trips, sample sizes, breakdowns, verified hazards, response time, unresolved cases, false positives, driver burden and itemized MXN costs. Recalculate wait reduction, crowding change, total cost and cost per trip. Missing or zero denominators show "Insufficient data", never NaN or Infinity.
5. Human decision: reviewer selects Continue, Revise or Stop and enters a required reason of 10–500 characters. Show whether the proposed 15% wait target was met, but never decide automatically. MX$2 fare and six-month extension remain unapproved scenarios.

Security and Blueprint conditions:
- No secrets, personal data, database or hidden tracking. Validate every input.
- Aggregate route/time results only; never score an individual driver.
- No automatic dispatch, sanction, subsidy or claim that reports prove fewer crashes.
- Show voluntary paid driver participation, independent hazard verification, authority closure, unresolved cases and the shadow clause from the packet.
- Store the demo decision only in browser session state.

Acceptance checks:
- 20-minute baseline and 17-minute pilot display 15% less waiting.
- 48% to 39% crowded trips displays a 9-percentage-point decrease.
- Zero baseline wait and zero trips show "Insufficient data".
- Each budget field updates total cost; invalid reason cannot be saved.
- Signed-out public production URL works on desktop and mobile.

Commit plan: packet first (already committed), starter plus this prompt, dashboard and map, telemetry and ML, evidence/budget/decision, then documented test fix and persona improvement. Deploy once for mechanical testing and again after the fix. Update DECISIONS.md at each session close, commit and push.
