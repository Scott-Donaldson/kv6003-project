import * as Discord from 'discord.js'
/**
 * Author W19019810
 * MessageHandler provides a bunch of static methods to parse different types of methods into specific output types
 */
export default class MessageHandler{
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
            default:
                throw new Error('Invalid output type')
        }
    }
    /**
     * Converts Classifier Result Object into Discord Rich Embed
     * @param {Classifier.resultObject} res 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed
     */
    static embedParser(res){
        if(!res) throw new Error('No resultsObject received')
        
        if(res.message.length > 256) res.message = res.message.slice(0,256) + "..."
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
                throw new Error('No log type specified')
            case 'console':
                this.outputToConsole(message)
                break
            case 'channel':
                if('channel' in params) this.outputToChannel(message, params.channel)
                else throw new Error ('Cannot find channel')
                break
        }
    }
    /**
     * Outputs Message to Console
     * @param {String} message 
     */
    static outputToConsole(message){
        console.log(message)
    }
    /**
     * Sends a string message to a channel
     * @param {String} message 
     * @param {Discord.Channel} channel 
     */
    static outputToChannel(message,channel){
        channel.send(message)
    }
    /**
     * Creates a basic discord rich embed and returns the object
     * @param {Object} params : {title: String, description: String}
     * @returns {Discord.MessageEmbed}
     */
    static basicEmbed(params={}){
        let embed = new Discord.MessageEmbed()
        if('title' in params) embed.setTitle(params.title)
        if('description' in params) embed.setDescription(params.description)
        return embed
    }
    /**
     * Edits a discord rich embed
     * @param {Object} params : {oldMessage: Discord.Message, newMessage: Discord.MessageEmbed}
     */
    static editEmbed(params={}){
        if(!'oldMessage' in params) throw new Error('No message to edit')
        if(!'newMessage' in params) throw new Error('No message to update')
        params.oldMessage.edit({embeds:[params.newMessage]})
    }
    /**
     * 
     * @param {Object} params : {message: Discord.MessageEmbed, channel: Discord.Channel}
     * @returns 
     */
    static sendEmbed(params={}){
        if(!'message' in params) throw new Error('No message to send')
        if(!'channel' in params) throw new Error('No channel to send message to')
        return new Promise(resolve => {
            params.channel.send({embeds:[params.message]}).then(message => resolve(message))
        })
    }
}