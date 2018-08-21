import React from 'react'
import PropTypes from 'prop-types'

import Sound from 'react-sound'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { Row, Col, Button } from 'antd'

import mobxstore from './mobx/rhythms'

import { Beats, RhythmsList, MicrophoneVisualizer } from './components'

import registerServiceWorker from './registerServiceWorker'

import './index.scss'

@observer
class App extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    const { store } = this.props
    const { beats, rhythms, player } = store

    const { playStatus, activeRhythm } = player

    const rhytmExam = beats.length !== 0
    const equalizerStyle = beats.length !== 0 ? { width: '200px', left: 'auto' } : {}
    
    return (
      <Row type="flex" justify="center" align="top" className="App">
        <Col xs={22} xl={18} className="Content">
          <Row type="flex" justify="space-between" align="center" className={!rhytmExam ? 'top' : 'top equalizer-row'}>
            <Row type={rhytmExam ? 'flex' : ''} justify="center">
              <MicrophoneVisualizer style={equalizerStyle} />
            </Row>
            <Row className="contacts">
              {/*
                <Button
                  icon="medium"
                  shape="circle"
                  className="contacts-button"
                />
              */}
              <Row display-if={!rhytmExam}>
                <Button
                  icon="mail"
                  shape="circle"
                  className="contacts-button"
                  onClick={() => { window.location = 'mailto:drums.rhythms.demo@gmail.com?subject=Drums rhythms demo' }}
                />
                <Button
                  icon="github"
                  shape="circle"
                  className="contacts-button"
                  onClick={() => { window.location = 'https://github.com/Squirre1/drums-rhythms-demo' }}
                />
              </Row>
            </Row>
          </Row>

          <Sound loop playStatus={playStatus} url={activeRhythm.url} />

          <Row display-if={!rhytmExam} type="flex" justify="center">
            <h1 className="header">Listen the rhythm</h1>
          </Row>

          { !rhytmExam ? (
            <RhythmsList
              player={player}
              rhythms={rhythms}
              passRhythm={store.passRhythm}
              changePlayStatus={store.changePlayStatus}
            />
          ) : (
            <Beats
              beats={beats}
              checkBeat={store.checkBeat}
              passRhythm={store.passRhythm}
              clearBeats={store.clearBeats}
            />
          )}
        </Col>
      </Row>
    );
  }
}

ReactDOM.render(<App store={mobxstore} />, document.getElementById('root'));
registerServiceWorker();
