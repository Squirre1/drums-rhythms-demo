/* eslint-disable */

import { average, ejectBeatsFromFreqArray } from './index'

var AudioContext = window.AudioContext || window.webkitAudioContext || false; 

export const getSoundBeats = (soundUrl) => new Promise((resolve) => {
  const audio = new Audio()
  audio.src = soundUrl
  audio.controls = true
  audio.crossOrigin = 'anonymous'

  const context = new AudioContext();
  const node = context.createScriptProcessor(256, 1, 1)

  const analyser = context.createAnalyser()
  analyser.fftSize = 32

  const bands = new Uint8Array(analyser.frequencyBinCount)

  let source

  audio.addEventListener('canplay', () => {
    if (!source) {
      source = context.createMediaElementSource(audio)

      source.connect(analyser)
      analyser.connect(node)
      node.connect(context.destination)
      source.connect(context.destination)

      audio.play()

      const arr = []
      node.onaudioprocess = async (audioProcessingEvent) => {
        analyser.getByteFrequencyData(bands)

        if (!audio.paused) {
          arr.push({ time: audio.currentTime, value: average(bands) })
          if (audio.currentTime >= 3) {
            await context.close()
            resolve(ejectBeatsFromFreqArray(arr))
          }
        }

      };
    }
  });
})

export const getStreamBeats = (stream) => new Promise((resolve) => {
  const context = new AudioContext();
  const node = context.createScriptProcessor(256, 1, 1)
  const source = context.createMediaStreamSource(stream)

  const analyser = context.createAnalyser()
  analyser.fftSize = 32

  const bands = new Uint8Array(analyser.frequencyBinCount)

  source.connect(analyser);
  analyser.connect(node);
  node.connect(context.destination);


  const arr = []
  node.onaudioprocess = async (audioProcessingEvent) => {
    analyser.getByteFrequencyData(bands);
    arr.push({ time: context.currentTime, value: average(bands) })
    if (context.currentTime >= 3) {
      await context.close()
      resolve(ejectBeatsFromFreqArray(arr))
    }
  }

})

export const drawMicrophoneSpectrum = () => {
  const h = document.getElementsByTagName('h1')[0]
  const paths = document.getElementsByTagName('path')
  const visualizer = document.getElementById('visualizer')
  const mask = visualizer.getElementById('mask')
  let path
  
  const soundAllowed = async (stream) => {
    window.persistAudioStream = stream;
    const audioContent = new AudioContext()
    const audioStream = audioContent.createMediaStreamSource(stream)

    const analyser = audioContent.createAnalyser()
    audioStream.connect(analyser)
    analyser.fftSize = 1024

    const frequencyArray = new Uint8Array(analyser.frequencyBinCount)

    visualizer.setAttribute('viewBox', '0 0 255 255')

    for (let i = 0; i < 255; i += 1) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-dasharray', '4,1');
      mask.appendChild(path);
    }
    const doDraw = () => {
      requestAnimationFrame(doDraw);
      analyser.getByteFrequencyData(frequencyArray);
      let adjustedLength;
      for (let i = 0; i < 255; i += 1) {
        adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
        paths[i].setAttribute('d', `M ${i},255 l 0,-${adjustedLength}`);
      }
    }
    doDraw();
  }

  const soundNotAllowed = (error) => {
    h.innerHTML = 'You must allow your microphone.'
    console.log(error)
  }

  navigator.getUserMedia({ audio: true, video: false }, soundAllowed, soundNotAllowed);
}
