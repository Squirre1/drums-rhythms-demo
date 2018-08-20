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

    return (
      <Row type="flex" justify="center" align="top" className="App">
        <Col xs={22} xl={18} className="Content">
          <Row className="contacts" display-if={beats.length === 0}>
            {/*<Button
              icon="medium"
              shape="circle"
              className="contacts-button"
            />*/}
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

          <Sound loop playStatus={playStatus} url={activeRhythm.url} />

          <Row display-if={beats.length === 0} type="flex" justify="center">
            <h1 className="header">Listen the rhythm</h1>
          </Row>

          { beats.length === 0 ? (
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
        <MicrophoneVisualizer />
      </Row>
    );
  }
}

ReactDOM.render(<App store={mobxstore} />, document.getElementById('root'));
registerServiceWorker();
