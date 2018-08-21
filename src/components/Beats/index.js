import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import ReactCountdownClock from 'react-countdown-clock'

import Beat from './Beat'

import './Beats.scss'

class Beats extends React.PureComponent {

  static propTypes = {
    beats: PropTypes.array.isRequired,
    checkBeat: PropTypes.func.isRequired,
    clearBeats: PropTypes.func.isRequired,
    passRhythm: PropTypes.func.isRequired
  }

  checkBeat = (index) => (record) => this.props.checkBeat(index, record)

  render() {
    const { beats, clearBeats, passRhythm } = this.props

    const activeBeats = beats.filter((el) => el.active)
    const statusesBeats = activeBeats.filter((el) => el.status !== 'pending')
    const passedBeatsLength = beats.filter((el) => el.status === 'passed').length

    const rhythmPassed = passedBeatsLength > 2

    return (
      <Fragment>
        <Row type="flex" justify="center" align="middle" className="beats">
          { beats.map((beat, index) => (
            <Col key={index}>
              <Beat beat={beat} checkBeat={this.checkBeat(index)} />
            </Col>
          )) }
        </Row>
        <Row display-if={activeBeats.length === 0} type="flex" justify="center" align="middle">
          <Col>
            <Row className="message">REPEAT IT VIA</Row>
            <Row type="flex" justify="center" align="middle">
              <ReactCountdownClock
                size={60}
                seconds={3}
                color="white"
                showMilliseconds={false}
              />
            </Row>
          </Col>
        </Row>
        <Row display-if={beats.length === statusesBeats.length} type="flex" justify="center" align="middle">
          <Col>
            <Button onClick={clearBeats}>
              COME BACK
            </Button>
          </Col>
          <Col display-if={!rhythmPassed} offset={1}>
            <Button icon="reload" type="primary" onClick={passRhythm}>
              TRY AGAIN
            </Button>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default Beats
