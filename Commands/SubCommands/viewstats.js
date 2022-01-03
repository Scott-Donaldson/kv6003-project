import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewStats {
  constructor (params) {
    this.params = params
  }

  run () {
    this.ViewStats()
  }

  ViewStats () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_VIEW_SYS_LOG')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_VIEW_SYS_LOG')
    MessageHandler.sendEmbed(
      {
        channel: this.params.message.channel,
        message: MessageHandler.generateStatsEmbed(this.params)
      })
  }
}
