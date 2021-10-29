import * as Discord from 'discord.js'
import * as fs from 'fs'
import config from './config.js'
import { MessageHandler } from './messagehandler.js'
class CommandHandler{
    constructor(){
        this._commands = new Discord.Collection()
        this.loadCommands()
    }
    loadCommands = () => {
        let commandFiles = fs.readdirSync('./Commands').filter(f => f.endsWith('.js'))
        commandFiles.forEach((e,i) => {
            if(config.DEV_MODE) MessageHandler.log('console', `[ BOT ] ${i+1}/${commandFiles.length} | ${e} Loaded`)
            import(`../Commands/${e}`).then(cmd => this.commands.set(cmd.name, cmd))
        })
    }
    get commands(){
        return this._commands
    }
    getCommand = name => {
        if(this.commandExists(name)) return this._commands.get(name)
        else return
    }
    commandExists = name => {
        return this._commands.has(name)
    }
    reload = name => {
        if(!this.commandExists(name)) return
        
    }
}

export{ CommandHandler }