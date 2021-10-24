import {Client, Intents} from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

import * as classifier from "./Utils/classifier.js"

import 'dotenv/config'

const PREFIX = "!";
//discord.com/oauth2/authorize?client_id=897117855806537739&permissions=8&scope=bot

client.login(process.env.TOKEN);

client.on('ready', ()=>{
    console.log(`[ BOT ] ${client.user.username} is online!`)
    client.user.setPresence({activities: [{name: "your messages", type: "WATCHING"}]})
})

client.on('messageCreate', message => {
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        //COMMAND HANDLING
    }else{
        console.log(classifier.classifyMessage(message.content, 0.65));
    }
})
