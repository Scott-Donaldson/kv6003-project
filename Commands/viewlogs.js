import MessageHandler from '../Utils/messagehandler.js'

const name = 'viewlogs'
const execute = (params = {}) => {
  let messages
  if (params.args.length < 0) MessageHandler.outputToChannel('missing arguments', params.message.channel)
  if (params.args[0].toLowerCase() === 'system') {
    messages = params.dba.getSystemLogMessages()
  } else {
    const uid = params.args[0]
    messages = params.dba.getUsersMessagesFromLog(uid)
  }
  console.log(messages)
}

export { name, execute }
