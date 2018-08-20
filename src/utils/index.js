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

export const ejectBeatsFromFreqArray = (arr) => {
  const splined = []
  const uniqTimeArr = uniqBy(prop('time'), arr)

  // empirically
  const xs = uniqTimeArr.reduce((acc, r, index) => (index % 8 === 0) ? [...acc, r.time] : acc, [])
  const ys = uniqTimeArr.reduce((acc, r, index) => (index % 8 === 0) ? [...acc, r.value] : acc, [])

  for (let i = 0; i < xs.length; i += 1) {
    splined.push({ time: xs[i], value: spline(xs[i], xs, ys) });
  }

  const beats = []

  splined.forEach((value, i) => {
    if (splined[i - 1] && splined[i + 1]) {
      if (splined[i - 1].value < splined[i].value && splined[i + 1].value < splined[i].value) {
        if (splined[i].value > CLAP_KNOCK_THRESHOLD) {
          beats.push(splined[i])
        }
      }
    }
  })

  return beats
}

export { getSoundBeats, getStreamBeats, drawMicrophoneSpectrum }
