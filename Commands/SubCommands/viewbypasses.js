import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewBypasses {
  constructor (params) {
    this.params = params
  }

  run () {
    this.viewBypasses()
  }

  viewBypasses () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_ADD_BYPASS')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_ADD_BYPASS')

    const bm = this.params.bm
    MessageHandler.displayBypasses({
      invokerID: this.params.message.author.id,
      bm: bm,
      bypasses: bm.getAllBypassesSorted(),
      channel: this.params.message.channel
    })
  }
}
