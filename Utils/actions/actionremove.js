import Action from './action.js'

export default class ActionRemove extends Action {
  static run (params = {}) {
    params.message.delete(1000)
  }
}
