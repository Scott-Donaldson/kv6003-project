import {Client, Intents} from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
import { Classifier } from './Utils/classifier.js'
import config from './Utils/config.js'


let classifier = new Classifier(Classifier.defaultThreashold())
import 'dotenv/config'

const PREFIX = config.prefix
//discord.com/oauth2/authorize?client_id=897117855806537739&permissions=8&scope=bot

client.login(process.env.TOKEN)

client.on('ready', ()=>{
    console.log(`[ BOT ] ${client.user.username} is online!`)
    client.user.setPresence({activities: [{name: "your messages", type: "WATCHING"}]})
})

client.on('messageCreate', async message => {
    let allowedChannels = config.allowedChannels
    if(!allowedChannels.includes(message.channel.id)) return;

    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        let args = message.content.split(" ")
        //COMMAND HANDLING
    }else{
        //General Message Moderation
        let res = await classifier.classifyMessage(message.content, 0.65)
        console.log(res)
    }
})
