import * as Discord from 'discord.js'
import { MessageHandler } from '../Utils/messagehandler.js'

let name = 'ping'
let execute = (params = {}) => {
    if(!'message' in params) throw new Error('Missing message parameter')
    let oldMessage = MessageHandler.basicEmbed({
        title: name,
        description: 'Pinging...'
    })

    MessageHandler.sendEmbed({message: oldMessage, channel: params.message.channel}).then(m => {

        let newMessage = MessageHandler.basicEmbed({
            title: name,
            description: `Client: ${m.createdTimestamp - params.message.createdTimestamp}ms\nAPI: ${Math.round(params.client.ws.ping)}ms`
        })

        MessageHandler.editEmbed({oldMessage: m, newMessage: newMessage})
    })
}

export{name,execute}