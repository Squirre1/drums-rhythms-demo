import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, Col, Row } from 'antd'

import { isPlaying } from '../../utils'

import './RhythmsList.scss'

class Rhythm extends React.Component {

  static propTypes = {
    rhythm: PropTypes.object.isRequired,
    playStatus: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    passRhythm: PropTypes.func.isRequired,
    onPlayerClick: PropTypes.func.isRequired
  }

  render() {
    const { isActive, rhythm, playStatus, onPlayerClick, passRhythm } = this.props
    const { name, attempts, status } = rhythm

    const done = status === 'done'
    const failed = status === 'failed'

    return (
      <Col
        xs={24}
        sm={4}
        className={`
          rhythm
          ${done && 'rhythm-done'}
          ${failed && 'rhythm-failed'}
          ${!isActive ? 'rhythm-disabled' : 'rhythm-active'}
        `}
      >
        <Row type="flex" justify="center" align="middle" className="rhythm-row">
          <Row type="flex" justify="center" align="middle" className="rhythm-name-row">
            <Button
              size="small"
              shape="circle"
              display-if={isActive && !done}
              icon={isPlaying(playStatus) ? 'pause' : 'caret-right'}
              onClick={onPlayerClick}
            />
            <Col>
              <span className="rhythm-name">
                &nbsp;{name}&nbsp;<Icon display-if={done} type="check-circle" />
              </span>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" className="rhythm-attempts-row">

            <Button display-if={isActive && !done} type="primary" onClick={passRhythm}>
              {'I\'M READY'}
            </Button>

            <div>
              <span display-if={!isActive && !failed && !done} className="blocked">
                {'BLOCKED'}
              </span>
              <span display-if={done} className="attempts">
                {`ATTEMPTS: ${attempts || 0}`}
              </span>
            </div>

          </Row>
        </Row>


      </Col>
    )
  }

}

export default Rhythm
