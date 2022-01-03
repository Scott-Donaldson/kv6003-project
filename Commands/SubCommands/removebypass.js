import MessageHandler from '../../Utils/messagehandler.js'

export default class RemoveBypass {
  constructor (params) {
    this.params = params
  }

  run () {
    this.removeBypass()
  }

  removeBypass () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_ADD_BYPASS')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_ADD_BYPASS')
    this.params.bm.removeBypass(this.params.args[2])
  }
}
