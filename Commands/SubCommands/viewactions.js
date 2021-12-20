import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewActions {
  constructor (params) {
    this.params = params
  }

  run () {
    this.viewActions()
  }

  viewActions () {
    if (!this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_EDIT_CONF')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_EDIT_CONF')

    MessageHandler.displayBotActions({
      channel: this.params.message.channel,
      invokerUid: this.params.message.author.id,
      allActions: this.params.am.getActionNames(),
      setActions: this.params.am.getSetActions(),
      am: this.params.am,
      userHasPermission: this.params.pm.userHasPermission(this.params.message.author.id, 'CAN_EDIT_CONF'),
      adminUser: this.params.pm.isUserAdmin(this.params.message.author.id)
    })
  }
}
