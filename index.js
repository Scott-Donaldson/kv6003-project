import * as Discord from 'discord.js'
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]})
import { Classifier } from './Utils/classifier.js'
import config from './Utils/config.js'
import { MessageHandler } from './Utils/messagehandler.js'
import 'dotenv/config'


let classifier = new Classifier(Classifier.defaultThreashold())
const PREFIX = config.prefix

client.login(process.env.TOKEN)

/**
 * Client Ready Event Listener
 */
client.on('ready', ()=>{
    MessageHandler.log('console',`[ BOT ] ${client.user.username} is online!`)
    client.user.setPresence({activities: [{name: "your messages", type: "WATCHING"}]})
})

/**
 * Client messageCreate Event Listener
 * Triggers on every message sent.
 * Depending on if the message contains the prefix the bot will either handle the command or run the message through its classifier
 */
client.on('messageCreate', async message => {
    if(!config.allowedChannels.includes(message.channel.id)) return;

    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        let args = message.content.slice(PREFIX.length).trim().split(/ +/)
        let cmd = args[0]
        //COMMAND HANDLING
    }else{
        //General Message Moderation
        let res = await classifier.classifyMessage(message.content)
        if(!res.flagged) return
        MessageHandler.log('channel', {embeds: [MessageHandler.outputResults(res, 'embed')]}, {channel: message.channel})
    }
})
