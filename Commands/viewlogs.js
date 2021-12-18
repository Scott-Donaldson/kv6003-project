import MessageHandler from '../Utils/messagehandler.js'
import LogParser from '../Utils/logparser.js'

const name = 'viewlogs'
const execute = (params = {}) => {
  let messages = []

  if (params.args.length < 2) {
    // Make this error more user friendly
    MessageHandler.outputToChannel('missing arguments', params.message.channel)
    return
  }
  // MessageHandler for Logging
  // LogParser for generating the correctly encoded text
  // LogParser helper functions for MessageHandler (Detect either system or user)

  // Logs Pagination
  // X log entries per page, generate multiple embeds with different title
  // When User clicks next, goes to next embed in array, updating embed id like ping command
  // Please dont forget this in the morning >:( this could be really cool.
  if (params.args[1].toLowerCase() === 'system') {
    messages = params.dba.getSystemLogMessages()
  } else {
    const uid = params.args[1]
    messages = params.dba.getUsersMessagesFromLog(uid)
  }
  LogParser.messageCountOutput(messages)
}

export { name, execute }
