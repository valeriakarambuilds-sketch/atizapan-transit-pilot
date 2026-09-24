import assert from 'node:assert/strict'
import { test } from 'node:test'
import { crowding, numberValue, ratio, validReason, waitReduction } from '../src/evidence.ts'

test('required sample comparisons', () => {
  assert.equal(waitReduction(20, 17), 15)
  assert.equal(crowding(48, 100) - crowding(39, 100), 9)
})
test('missing and zero denominators cannot produce nonfinite results', () => {
  for (const denominator of [null, 0]) {
    assert.equal(waitReduction(denominator, 17), null)
    assert.equal(ratio(14400, denominator), null)
    assert.equal(crowding(0, denominator), null)
  }
  assert.equal(waitReduction(20, null), null)
  assert.equal(ratio(null, 100), null)
  assert.equal(crowding(null, 100), null)
  assert.equal(waitReduction(20, 0), 100)
  assert.equal(ratio(0, 100), 0)
})
test('input ranges, finite values and aggregate counts', () => {
  for (const raw of ['', ' ', '-1', 'NaN', 'Infinity', '1e309', '1000001', 'bad']) assert.equal(numberValue(raw), null)
  assert.equal(numberValue('1.5', 100, true), null)
  assert.equal(numberValue('0', 100, true), 0)
  assert.equal(numberValue('100', 100, true), 100)
  assert.equal(crowding(101, 100), null)
  assert.equal(crowding(0, 100), 0)
})
test('budget cost per trip responds to every item', () => {
  const costs = [6000, 3000, 900, 2000, 1500, 1000]
  assert.equal(ratio(costs.reduce((a, b) => a + b), 100), 144)
  for (let index = 0; index < costs.length; index++) {
    const edited = costs.map((value, i) => value + (i === index ? 100 : 0))
    assert.equal(ratio(edited.reduce((a, b) => a + b), 100), 145)
  }
})
test('decision reason boundaries include trimming', () => {
  for (const reason of ['', ' '.repeat(10), 'a'.repeat(9), 'a'.repeat(501)]) assert.equal(validReason(reason), false)
  for (const reason of ['a'.repeat(10), 'a'.repeat(500), '  Review evidence again  ']) assert.equal(validReason(reason), true)
})
