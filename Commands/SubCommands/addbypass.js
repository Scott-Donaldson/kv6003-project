import MessageHandler from '../../Utils/messagehandler.js'

export default class AddBypass {
  constructor (params) {
    this.params = params
  }

  run () {
    this.addBypass()
  }

  addBypass () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_ADD_BYPASS')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_ADD_BYPASS')
    if (!this.params.bm.getBypassTypes().includes(this.params.args[3].toUpperCase())) return MessageHandler.invalidArgumentEmbed('Invalid Bypass Type', this.params.message.channel)
    this.params.bm.addBypass(this.params.args[2], this.params.args[3].toUpperCase())
    MessageHandler.success("Bypass Added", this.params.message.channel)
  }
}
