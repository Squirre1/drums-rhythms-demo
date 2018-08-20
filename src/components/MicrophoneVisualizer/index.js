import React from 'react'
import './MicrophoneVisualizer.scss'

import { drawMicrophoneSpectrum } from '../../utils'

class MicrophoneVisualizer extends React.PureComponent {

  componentDidMount() {
    window.onload = drawMicrophoneSpectrum
  }

  render() {
    return (
      <svg preserveAspectRatio="none" id="visualizer" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
          <mask id="mask">
            <g id="maskGroup" />
          </mask>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff0a0a', stopOpacity: 1 }} />
            <stop offset="20%" style={{ stopColor: '#f1ff0a', stopOpacity: 1 }} />
            <stop offset="90%" style={{ stopColor: '#d923b9', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#050d61', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" mask="url(#mask)" />
      </svg>
    )
  }

}

export default MicrophoneVisualizer
