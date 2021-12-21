import ActionAlert from './actions/actionalert.js'
import ActionWarn from './actions/actionwarn.js'
import ActionRemove from './actions/actionremove.js'

export default class ActionManager {
  constructor (dba) {
    this.connection = dba
    this.actionEnum = this.generateEnum(this.getActions())
  }

  generateEnum (actionMap) {
    const obj = {}
    actionMap.forEach(e => (obj[e.name] = e.flag))
    return obj
  }

  getActions () {
    return this.connection.getActions()
  }

  getActionNames () {
    return Object.keys(this.actionEnum)
  }

  getActionsValue () {
    return this.connection.getActionValue()
  }

  setActionValue (newVal) {
    this.connection.setActionValue(newVal)
  }

  getSetActions () {
    const actions = []
    for (const name of Object.keys(this.actionEnum)) {
      if (this.isActionEnabled(name)) actions.push(name)
    }
    return actions
  }

  isActionEnabled (action) {
    return ((this.getActionsValue() & this.actionEnum[action]) === this.actionEnum[action])
  }

  addAction (action) {
    this.setActionValue(this.getActionsValue() | this.actionEnum[action])
  }

  removeAction (action) {
    this.setActionValue(this.getActionsValue() & ~this.actionEnum[action])
  }

  toggleAction (action) {
    this.isActionEnabled(action) ? this.removeAction(action) : this.addAction(action)
  }

  responseActions () {
    const arr = []
    arr.push(ActionAlert)
    arr.push(ActionWarn)
    arr.push(ActionRemove)
    return arr
  }

  respond (params) {
    this.getActionNames.forEach((e, i) => {
      if (this.isActionEnabled(e)) this.responseActions()[i].run(params)
    })
  }
}
