import {Client, Intents} from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
import { Classifier } from './Utils/classifier.js'
import config from './Utils/config.js'


let classifier = new Classifier(Classifier.defaultThreashold())
import 'dotenv/config'

const PREFIX = config.prefix

client.login(process.env.TOKEN)

/**
 * Client Ready Event Listener
 */
client.on('ready', ()=>{
    console.log(`[ BOT ] ${client.user.username} is online!`)
    client.user.setPresence({activities: [{name: "your messages", type: "WATCHING"}]})
})

/**
 * Client messageCreate Event Listener
 * Triggers on every message sent.
 * Depending on if the message contains the prefix the bot will either handle the command or run the message through its classifier
 */
client.on('messageCreate', async message => {
    let allowedChannels = config.allowedChannels
    if(!allowedChannels.includes(message.channel.id)) return;

    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        let args = message.content.slice(PREFIX.length).trim().split(/ +/)
        let cmd = args[0]
        //COMMAND HANDLING
    }else{
        //General Message Moderation
        let res = await classifier.classifyMessage(message.content)
        console.log(res)
    }
})
