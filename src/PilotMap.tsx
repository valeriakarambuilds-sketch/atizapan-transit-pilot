import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { estimateWait } from './waitModel'
import 'leaflet/dist/leaflet.css'

const stops: { name: string; point: L.LatLngTuple }[] = [
  { name: 'Sample stop A', point: [19.554, -99.273] },
  { name: 'Sample stop B', point: [19.557, -99.267] },
  { name: 'Sample stop C', point: [19.561, -99.261] },
]

export default function PilotMap() {
  const container = useRef<HTMLDivElement>(null)

  const [tick, setTick] = useState(0)
  const [tilesFailed, setTilesFailed] = useState(false)
  const vehicle = useRef<L.CircleMarker | null>(null)
  // A fixed invented clock and repeating route; no device location is read.
  const phase = (tick % 120) / 60
  const progress = phase <= 1 ? phase : 2 - phase
  const segment = progress < 0.5 ? 0 : 1
  const fraction = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2
  const latitude = stops[segment].point[0] + fraction * (stops[segment + 1].point[0] - stops[segment].point[0])
  const longitude = stops[segment].point[1] + fraction * (stops[segment + 1].point[1] - stops[segment].point[1])
  const speed = Math.round(16 + 4 * Math.sin(tick / 10))
  const timestamp = new Date(Date.UTC(2026, 8, 24, 14) + tick * 1000).toISOString()

  useEffect(() => {
    const timer = window.setInterval(() => setTick(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!container.current) return

    const map = L.map(container.current).setView([19.557, -99.267], 14)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).on('tileerror', () => setTilesFailed(true)).addTo(map)

    vehicle.current = L.circleMarker(stops[0].point, {
      radius: 12, color: '#173a38', fillColor: '#ffbc52', fillOpacity: 1, weight: 3,
    }).addTo(map).bindTooltip('Simulated vehicle', { permanent: true })

    L.polyline(stops.map((stop) => stop.point), {
      color: '#0c7771',
      weight: 5,
    }).addTo(map)

    stops.forEach((stop) => {
      L.circleMarker(stop.point, {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#0c7771',
        fillOpacity: 1,
      }).addTo(map).bindPopup(`${stop.name} — simulated location`)
    })

    return () => { vehicle.current = null; map.remove() }
  }, [])

  useEffect(() => {
    vehicle.current?.setLatLng([latitude, longitude])
  }, [latitude, longitude])

  return (
    <section className="map-card" aria-label="Map of three simulated stops">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GEODATA · SAMPLE CORRIDOR</span>
          <h2>Three-stop pilot map</h2>
        </div>
        <span className="pill">Route unconfirmed</span>
      </div>
      <div ref={container} className="pilot-map" />
      {tilesFailed && <p role="status">Map tiles unavailable. The simulated route and markers remain visible; stop coordinates are listed below.</p>}
      <p className="muted">{stops.map(stop => `${stop.name}: ${stop.point.join(', ')}`).join(' · ')}</p>
      <div className="telemetry-grid">
        <article>
          <h3>Simulated telemetry</h3>
          <p>GPS: {latitude.toFixed(5)}, {longitude.toFixed(5)} · Speed: {speed} km/h</p>
          <p>Sample timestamp: <time>{timestamp}</time></p>
          <p>Invented playback, not live tracking. Sample time slot: morning peak.</p>
        </article>
        <article>
          <h3>Simulated ML estimate</h3>
          <strong>{estimateWait(speed, true)} minutes estimated wait</strong>
          <p>Local regression trains only on invented observations of speed and time slot. It has no validated real-world accuracy; uncertainty is uncalibrated.</p>
          <p>This prediction is separate from sample baseline and pilot evidence and is not a measured improvement.</p>
        </article>
      </div>
      <p className="muted">
        Illustrative coordinates near Atizapán. These stops and the connecting
        line are not an approved route. Map tiles © OpenStreetMap contributors.
      </p>
    </section>
  )
}
