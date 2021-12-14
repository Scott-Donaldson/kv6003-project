import {MessageHandler} from './messagehandler.js'
import 'discord.js'

export const test = () => {
    MessageHandler.log("Test")
}

export const invalidType = (m ,c) => {
    if(c){
        MessageHandler.sendEmbed({
            embed: MessageHandler.basicEmbed({
                title: "Invalid Input",
                message: m
            }),
            channel: c
        })
    }else{
        MessageHandler.log(`[ ERR ] Invalid Type: ${m} `)
    }

}
export const missingParam = (m ,c) => {
    if(c){
        MessageHandler.sendEmbed({
            embed: MessageHandler.basicEmbed({
                title: "Missing Parameter",
                message: m
            }),
            channel: c
        })
    }else{
        MessageHandler.log(`[ ERR ] Missing Paramenter: ${m} `)
    }

}