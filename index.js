import * as Discord from 'discord.js'
import Classifier from './Utils/classifier.js'
import config from './Utils/config.js'
import MessageHandler from './Utils/messagehandler.js'
import 'dotenv/config'
import CommandHandler from './Utils/commandhandler.js'
import DatabaseAbstraction from './Utils/databaseabstraction.js'
import figlet from 'figlet'

MessageHandler.log('console', figlet.textSync(config.BOTNAME))
if (config.DEV_MODE) MessageHandler.log('console', '[ DEV ] Dev Mode Enabled')

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })
client.login(process.env.TOKEN)
const PREFIX = config.PREFIX

const dba = new DatabaseAbstraction()
const classifier = new Classifier(dba.getClassifierThreashold())
const cmdHandler = new CommandHandler()

/**
 * Client Ready Event Listener
 */
client.on('ready', () => {
  MessageHandler.log('console', `[ BOT ] ${client.user.username} is online!`)
  cmdHandler.loadCommands()
  client.user.setPresence({ activities: [{ name: 'your messages', type: 'WATCHING' }] })
})

/**
 * Client messageCreate Event Listener
 * Triggers on every message sent.
 * Depending on if the message contains the prefix the bot will either handle the command or run the message through its classifier
 */
client.on('messageCreate', async message => {
  if (!config.ALLOWED_CHANNELS.includes(message.channel.id)) return

  if (message.author.bot) return
  if (message.content.startsWith(PREFIX)) {
    // Command Handler
    const args = message.content.slice(PREFIX.length).trim().split(/ +/)
    const cmd = args[0]
    const params = {
      client: client,
      message: message,
      args: args,
      database: dba
    }
    cmdHandler.getCommand(cmd)?.execute(params)
  } else {
    dba.incrementCount('messages_checked')
    const res = await classifier.classifyMessage(message.content)
    if (!res.flagged) return
    dba.incrementCount('messages_flagged')
    dba.logUserMessage(message.content)
    MessageHandler.log('channel', { embeds: [MessageHandler.outputResults(res, 'embed')] }, { channel: message.channel })
  }
})
