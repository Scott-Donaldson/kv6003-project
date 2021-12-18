import MessageHandler from '../Utils/messagehandler.js'

const name = 'viewlogs'
const execute = (params = {}) => {
  if (params.args.length < 2) {
    MessageHandler.outputToChannel('missing arguments', params.message.channel)
    return
  }
  if (params.args[1].toLowerCase() === 'system') {
    MessageHandler.paginationEmbedHandler({ 
      channel: params.message.channel, 
      title: "System",
      entries: params.dba.getSystemLogMessages()
    })
  } else {
    const uid = params.args[1]
    MessageHandler.paginationEmbedHandler({ 
      channel: params.message.channel, 
      title: "User",
      entries: params.dba.getUserMessagesFromLog(uid)
    })
  }
}

export { name, execute }
