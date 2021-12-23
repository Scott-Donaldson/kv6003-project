import Action from './action.js'
import config from '../config.js'
import MessageHandler from '../messagehandler.js'

export default class ActionAlert extends Action {
  static run (params = {}) {
    const channel = params.client.channels.cache.find(c => c.id === config.CHANNELS.LOG_CHANNEL)
    const mentionRole = `<@&${config.ROLES.ALERT_ROLE}>`
    const title = 'User has been toxic'

    const embed = MessageHandler.outputResults({
      title: title,
      res: params.res,
      message: params.message,
      role: mentionRole
    }, 'embed')
    MessageHandler.log('channel', { embeds: [embed] }, { channel: channel })
  }
}
