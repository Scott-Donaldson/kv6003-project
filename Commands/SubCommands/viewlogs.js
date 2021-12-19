import MessageHandler from '../../Utils/messagehandler.js'

export default class ViewLogs {
  constructor (params) {
    this.params = params
  }

  run () {
    if (this.params.args[2] === 'system') this.viewSystemLogs()
    else this.viewUserLogs()
  }

  viewSystemLogs () {
    MessageHandler.paginationEmbedHandler({
      channel: this.params.message.channel,
      title: 'System',
      entries: this.params.dba.getSystemLogMessages(),
      invokerUid: this.params.message.author.id
    })
  }

  viewUserLogs () {
    const uid = this.params.args[2]
    MessageHandler.paginationEmbedHandler({
      channel: this.params.message.channel,
      title: 'User',
      entries: this.params.dba.getUsersMessagesFromLog(uid),
      invokerUid: this.params.message.author.id
    })
  }
}
