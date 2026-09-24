type Observation = {
  speedKmh: number
  peakHour: number
  waitMinutes: number
}

// Invented training examples. This model has no measured real-world accuracy.
const training: Observation[] = [
  { speedKmh: 8, peakHour: 1, waitMinutes: 23 },
  { speedKmh: 12, peakHour: 1, waitMinutes: 20 },
  { speedKmh: 16, peakHour: 1, waitMinutes: 17 },
  { speedKmh: 20, peakHour: 1, waitMinutes: 15 },
  { speedKmh: 10, peakHour: 0, waitMinutes: 17 },
  { speedKmh: 15, peakHour: 0, waitMinutes: 14 },
  { speedKmh: 20, peakHour: 0, waitMinutes: 11 },
  { speedKmh: 25, peakHour: 0, waitMinutes: 9 },
]

// Fit a small linear regression by gradient descent in the browser.
function trainModel() {
  let bias = 0
  let speedWeight = 0
  let peakWeight = 0

  for (let epoch = 0; epoch < 4000; epoch++) {
    let biasGradient = 0
    let speedGradient = 0
    let peakGradient = 0

    for (const row of training) {
      const normalizedSpeed = row.speedKmh / 30
      const error =
        bias + speedWeight * normalizedSpeed +
        peakWeight * row.peakHour - row.waitMinutes
      biasGradient += error
      speedGradient += error * normalizedSpeed
      peakGradient += error * row.peakHour
    }

    const step = 0.04 / training.length
    bias -= step * biasGradient
    speedWeight -= step * speedGradient
    peakWeight -= step * peakGradient
  }

  return { bias, speedWeight, peakWeight }
}

const model = trainModel()

export function estimateWait(speedKmh: number, peakHour: boolean) {
  const result =
    model.bias +
    model.speedWeight * (speedKmh / 30) +
    model.peakWeight * Number(peakHour)

  return Math.max(0, Math.round(result))
}
