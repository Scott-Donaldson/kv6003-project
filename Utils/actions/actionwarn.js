import MessageHandler from '../messagehandler.js'
import Action from './action.js'

export default class ActionWarn extends Action {
  static run (params = {}) {
    console.log("THIS RAN")
    const embed = MessageHandler.basicEmbed({
      title: 'Warning!',
      description: 'Dont be toxic!',
      colour: 'RED'
    })
    MessageHandler.sendEmbed({
      message: embed,
      channel: params.message.channel
    }).then(msg => setTimeout(() => msg.delete(), 10_000))
  }
}
