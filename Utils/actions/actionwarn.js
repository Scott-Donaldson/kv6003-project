import MessageHandler from '../messagehandler.js'
import Action from './action.js'

export default class ActionWarn extends Action {
  static run (params = {}) {
    MessageHandler.sendEmbed({
      embed: MessageHandler.basicEmbed({
        title: 'Warning!',
        description: 'Dont be toxic!',
        colour: 'RED'
      }),
      channel: params.message.channel
    }).then(msg => msg.delete(5000))
  }
}
