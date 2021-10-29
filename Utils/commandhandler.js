import * as Discord from 'discord.js'
import * as fs from 'fs'
import config from './config.js'
import { MessageHandler } from './messagehandler.js'
class CommandHandler{
    constructor(){
        this._commands = new Discord.Collection()
        this.loadCommands()
    }
    /**
     * Loads commands from a Command folder in root folder
     */
    loadCommands = () => {
        let commandFiles = fs.readdirSync('./Commands').filter(f => f.endsWith('.js'))
        commandFiles.forEach((e,i) => {
            if(config.DEV_MODE) MessageHandler.log('console', `[ BOT ] ${i+1}/${commandFiles.length} | ${e} Loaded`)
            import(`../Commands/${e}`).then(cmd => this.commands.set(cmd.name, cmd))
        })
    }
    /**
     * @returns {Discord.Collection}
     */
    get commands(){
        return this._commands
    }
    /**
     * Retunrs a command to execute if it exists
     * @param {String} name 
     * @returns Command | undefined
     */
    getCommand = name => {
        if(this.commandExists(name)) return this._commands.get(name)
        else return
    }
    /**
     * Checks if a command is in the Collection
     * @param {String} name 
     * @returns {Boolean}
     */
    commandExists = name => {
        return this._commands.has(name)
    }
    /**
     * Reloads a command for hot reloading of commands
     * @param {String} name 
     */
    reload = name => {
        if(!this.commandExists(name)) return
        
    }
}

export{ CommandHandler }