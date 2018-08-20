import Sound from 'react-sound'
import { observable, action } from 'mobx'
import { notification } from 'antd';

import { isPlaying, compareBeats } from '../utils'
import { INIT_RHYTHMS, INIT_BEATS } from '../consts'

class ObservableStore {

  @observable error

  @observable loading

  @observable beats = []

  @observable rhythms = INIT_RHYTHMS

  @observable.struct player = {
    activeRhythm: INIT_RHYTHMS[0],
    playStatus: Sound.status.STOPPED
  }

  @action
  clearBeats = () => {
    this.beats = []
  }

  @action
  changePlayStatus = () => {
    const { playStatus } = this.player

    this.player = {
      ...this.player,
      playStatus: isPlaying(playStatus) ? Sound.status.STOPPED : Sound.status.PLAYING
    }
  }

  @action
  checkBeat = (index, record) => {
    const beats = [...this.beats]

    beats[index] = {
      ...beats[index],
      status: compareBeats(record, this.player.activeRhythm.beats)
    }

    if (index + 1 === beats.length) {
      const rhythms = [...this.rhythms]
      const rhythm = rhythms[this.player.activeRhythm.id]
      rhythm.attempts = rhythm.attempts ? rhythm.attempts + 1 : 1

      const passedBeats = beats.filter((el) => el.status === 'passed')

      if (passedBeats.length > 2) {
        rhythm.status = 'done'

        const nextRhythm = this.rhythms[this.player.activeRhythm.id + 1]

        if (nextRhythm) {
          this.player = { ...this.player, activeRhythm: nextRhythm }
        }

      } else {
        rhythm.status = 'failed'
      }

      this.rhythms = rhythms

      if (rhythms.every((r) => r.status === 'done')) {
        notification.config({
          placement: 'topRight',
          duration: 0,
        });

        notification.open({
          message: 'That\'s all for now!',
          description: 'If you like it, write me somewhere',
        });
      }
    }

    this.beats = beats
  }

  @action
  passRhythm = () => {
    this.beats = [...INIT_BEATS]

    this.player = {
      ...this.player,
      playStatus: Sound.status.STOPPED
    }

    const interval = setInterval(() => {
      const beats = [...this.beats]

      const activeBeatsLength = this.beats.filter((el) => el.active).length

      if (activeBeatsLength === 4) {
        clearInterval(interval)
      } else {
        beats[activeBeatsLength] = { active: true, status: 'pending' }
        this.beats = beats
      }
    }, 2900)
  }
}


export { ObservableStore }

const observableStore = new ObservableStore()
export default observableStore
