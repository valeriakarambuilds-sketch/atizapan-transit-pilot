import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const stops: { name: string; point: L.LatLngTuple }[] = [
  { name: 'Sample stop A', point: [19.554, -99.273] },
  { name: 'Sample stop B', point: [19.557, -99.267] },
  { name: 'Sample stop C', point: [19.561, -99.261] },
]

export default function PilotMap() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const map = L.map(container.current).setView([19.557, -99.267], 14)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

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

    return () => { map.remove() }
  }, [])

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
      <p className="muted">
        Illustrative coordinates near Atizapán. These stops and the connecting
        line are not an approved route. Map tiles © OpenStreetMap contributors.
      </p>
    </section>
  )
}
