export default class RemoveBypass {
  constructor (params) {
    this.params = params
  }

  run () {
    this.removeBypass()
  }

  removeBypass () {
    this.params.dba.removeBypass(this.params.args[2])
  }
}
