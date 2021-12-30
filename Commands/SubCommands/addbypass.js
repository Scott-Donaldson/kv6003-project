export default class AddBypass {
  constructor (params) {
    this.params = params
  }

  run () {
    this.addBypass()
  }

  addBypass () {
    this.params.dba.addBypass(this.params.args[2], this.params.args[3])
  }
}
