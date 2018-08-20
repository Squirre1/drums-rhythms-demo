import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

import { getStreamBeats } from '../../../utils'

import './Beat.scss'

class Beat extends React.PureComponent {

  static propTypes = {
    beat: PropTypes.object.isRequired,
    checkBeat: PropTypes.func.isRequired
  }

  componentWillReceiveProps = async (nextProps) => {
    const { beat, checkBeat } = this.props

    if (beat.active !== nextProps.beat.active) {
      if (nextProps.beat.active !== false) {
        console.log('change status, start record beat')
        const record = await getStreamBeats(window.persistAudioStream)
        checkBeat(record)
      }
    }
  }

  render() {
    const { beat } = this.props
    const { active, status } = beat

    const passed = status === 'passed'

    return (
      <div className="wrapper">
        <Fragment display-if={active}>
          <div className="strip strip-a"></div>
          <div className="strip strip-b"></div>
          <div className="strip strip-c"></div>
          <div className="strip strip-d"></div>
        </Fragment>
        <div className={`square ${active ? '' : 'square-disabled'}`}>
          <Fragment display-if={status && status !== 'pending'}>
            <Icon display-if={passed} type="check-circle" />
            <Icon display-if={!passed} type="close-circle" />
          </Fragment>
        </div>
      </div>
    )
  }

}

export default Beat
