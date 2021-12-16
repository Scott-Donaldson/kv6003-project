import MessageHandler from '../Utils/messagehandler.js'

const name = 'ping'
const execute = (params = {}) => {
  if ('message' in params === false) throw new Error('Missing message parameter')
  const oldMessage = MessageHandler.basicEmbed({
    title: name,
    description: 'Pinging...'
  })

  MessageHandler.sendEmbed({ message: oldMessage, channel: params.message.channel }).then(m => {
    const newMessage = MessageHandler.basicEmbed({
      title: name,
      description: `Client: ${m.createdTimestamp - params.message.createdTimestamp}ms\nAPI: ${Math.round(params.client.ws.ping)}ms`
    })

    MessageHandler.editEmbed({ oldMessage: m, newMessage: newMessage })
  })
}

export { name, execute }
