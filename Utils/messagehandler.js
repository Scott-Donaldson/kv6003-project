import * as Discord from 'discord.js'
/**
 * Author W19019810
 * MessageHandler provides a bunch of static methods to parse different types of methods into specific output types
 */
class MessageHandler{
    /**
     * Outputs results
     * Takes type
     * @param {Classifier.resultObject} res Discord.MessageEmbed
     * @param {String} type "text" | "embed" | "object"
     */
    static outputResults(res, type){
        switch(type.toLowerCase()){
            case 'text':
                break
            case 'embed':
                return this.embedParser(res)
            case 'object':
                break
        }
    }
    /**
     * Converts Classifier Result Object into Discord Rich Embed
     * @param {Classifier.resultObject} res 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed
     */
    static embedParser(res){
        let embed = new Discord.MessageEmbed()

        let messageContent = `Message Flagged! \n`
        Object.keys(res.results).forEach(e => {
            messageContent += res.results[e] ? `${e}\n` : ""
        })

        embed.setTitle(`Message Detection`)
        embed.setDescription(messageContent)
        embed.addField("Info",`Execution Time: ${res.executionTime.seconds}s ${res.executionTime.milliseconds}ms\nMessage: ${res.message}`,true)
        return embed
    }
    /**
     * System Message Log Handler
     * @param {String} type "console" | "text"
     * @param {String} text 
     */
    static log(type, message, params={}){
        switch(type.toLowerCase()){
            default:
            case 'console':
                this.outputToConsole(message)
                break
            case 'channel':
                if('channel' in params) this.outputToChannel(message, params.channel)
                else throw new Error ('Cannot find channel')
                break;
        }
    }
    static outputToConsole(message){
        console.log(message)
    }
    static outputToChannel(message,channel){
        channel.send(message)
    }
}
export {MessageHandler}