import MessageHandler from '../../Utils/messagehandler.js'

export default class SetThreashold {
  constructor (params) {
    this.params = params
  }

  run () {
    this.setThreashold()
  }

  setThreashold () {
    const val = parseInt(this.params.args[2])
    if (isNaN(val)) return MessageHandler.log('channel', 'Invalid parameter', { channel: this.params.message.channel })
    if (val < 0 || val >= 10) return MessageHandler.log('channel', 'Invalid parameter', { channel: this.params.message.channel })
    this.params.dba.setClassifierThreashold(val)
  }
}
