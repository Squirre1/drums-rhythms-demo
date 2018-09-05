import Sound from 'react-sound'
import spline from 'cubic-spline'
import { uniqBy, prop } from 'ramda'

import { getSoundBeats, getStreamBeats, drawMicrophoneSpectrum } from './sounds'

// empirically
const CLAP_KNOCK_THRESHOLD = 40

const difference = (a = 0, b = 0) => Math.abs(a - b)


export const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
export const isPlaying = (playStatus) => playStatus === Sound.status.PLAYING

export const compareBeats = (beats1, beats2) => {

  if (difference(beats1.length, beats2.length) > 2) return 'failed'

  let timeDifference = 0
  let freqDifference = 0

  beats2.forEach((secondBeat, index) => {
    const firstBeat = beats1[index] || {}

    timeDifference += difference(firstBeat.time, secondBeat.time)
    freqDifference += difference(firstBeat.value, secondBeat.value)
  })

  console.log(beats1, beats2)
  console.log(`td: ${timeDifference} fd: ${freqDifference}`)

  return timeDifference < (beats2.length / 4) + 1 ? 'passed' : 'failed'
}

// empirically
const putEveryN = (n) => (
  (acc, r, index) => (
    (index % n === 0) ? ({ xs: [...acc.xs, r.time], ys: [...acc.ys, r.value] }) : acc
  )
)

const findPeak = (acc, point, i, arr) => {

  if (arr[i - 1] && arr[i + 1]) {

    const notExtraNoise = arr[i].value > CLAP_KNOCK_THRESHOLD
    const isPeak = arr[i - 1].value < arr[i].value && arr[i + 1].value < arr[i].value

    return (notExtraNoise && isPeak) ? [...acc, arr[i]] : acc
  }

  return acc
}

export const ejectBeatsFromFreqArray = (arr) => {
  const uniqTimeArr = uniqBy(prop('time'), arr)

  const { xs, ys } = uniqTimeArr.reduce(putEveryN(8), { xs: [], ys: [] })
  const splined = xs.map((time) => ({ time, value: spline(time, xs, ys) }))

  return splined.reduce(findPeak, [])
}

export { getSoundBeats, getStreamBeats, drawMicrophoneSpectrum }
