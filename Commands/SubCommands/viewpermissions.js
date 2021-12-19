import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewPermissions {
  constructor (params) {
    this.params = params
  }

  run () {
    if (this.params.args[2] !== undefined) this.viewUserPermissions(this.params.args[2])
    else this.viewUserPermissions(this.params.message.author.id)
  }

  viewUserPermissions (uid) {
    if(!this.params.pm.userHasPermission('CAN_ADD_PERMS')) return MessageHandler.missingPermission(this.params.message.channel, 'CAN_ADD_PERMS')  
    const pm = this.params.pm

    MessageHandler.displayUserPermissions({
      permissionUid: uid,
      channel: this.params.message.channel,
      userPermissions: pm.getUserPermissions(uid),
      invokerUid: this.params.message.author.id,
      allPermissions: pm.getAvailablePermissions(),
      adminUser: pm.isUserAdmin(this.params.message.author.id),
      userHasPermission: pm.userHasPermission(this.params.message.author.id, 'CAN_ADD_PERMS'),
      pm: pm
    })
  }
}
