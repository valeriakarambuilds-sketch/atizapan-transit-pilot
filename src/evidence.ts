export const insufficient = 'Insufficient data'
export function numberValue(raw: string, max = 1000000, integer = false): number | null {
  if (!raw.trim()) return null
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 && value <= max && (!integer || Number.isInteger(value)) ? value : null
}
export function ratio(numerator: number | null, denominator: number | null): number | null {
  return numerator !== null && denominator !== null && denominator > 0 ? numerator / denominator : null
}
export function waitReduction(baseline: number | null, pilot: number | null): number | null {
  return baseline !== null && pilot !== null && baseline > 0 ? (baseline - pilot) / baseline * 100 : null
}
export function crowding(crowded: number | null, trips: number | null): number | null {
  return crowded !== null && trips !== null && crowded <= trips ? ratio(crowded * 100, trips) : null
}
export function validReason(reason: string) {
  return reason.trim().length >= 10 && reason.trim().length <= 500 && reason.length <= 500
}
export const format = (value: number) => Number(value.toFixed(2)).toLocaleString('en-US')
