import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewBypasses {
  constructor (params) {
    this.params = params
  }

  run () {
    this.viewBypasses()
  }

  viewActions () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_ADD_BYPASS')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_ADD_BYPASS')
  }
}
