import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'

import Rhythm from './Rhythm'
import './RhythmsList.scss'

class RhythmsList extends React.PureComponent {

  static propTypes = {
    player: PropTypes.object.isRequired,
    rhythms: PropTypes.array.isRequired,
    passRhythm: PropTypes.func.isRequired,
    changePlayStatus: PropTypes.func.isRequired
  }

  render() {
    const { player, rhythms, passRhythm, changePlayStatus } = this.props
    const { activeRhythm: { id: activeRhythmId }, playStatus } = player

    return (
      <Row type="flex" justify="space-between">
        {rhythms.map((rhythm) => (
          <Rhythm
            key={rhythm.id}
            rhythm={rhythm}
            playStatus={playStatus}
            isActive={rhythm.id === activeRhythmId}
            passRhythm={passRhythm}
            onPlayerClick={changePlayStatus}
          />
        ))}
      </Row>
    )
  }

}

export default RhythmsList
