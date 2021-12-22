import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewStats {
  constructor (params) {
    this.params = params
  }

  run () {
    this.ViewStats()
  }

  ViewStats () {
    MessageHandler.sendEmbed(
      {
        channel: this.params.message.channel,
        message: MessageHandler.generateStatsEmbed(this.params)
      })
  }
}
