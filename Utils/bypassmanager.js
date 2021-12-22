export default class BypassManager {
  constructor (dba) {
    this.dba = dba
    this.validTypes = ['USER', 'CHANNEL', 'ROLE']
  }

  getAllBypasses () {
    return this.dba.getAllBypasses()
  }

  getAllBypassesArray () {
    const arr = []
    this.getAllBypasses().forEach(e => { arr.push(e.id) })
    return arr
  }

  addBypass (bypassid, type) {
    this.dba.addBypass(bypassid, type)
  }

  removeBypass (bypassid) {
    this.dba.removeBypass(bypassid)
  }

  bypass (bypassidarr = []) {
    return bypassidarr.some(e => this.getAllBypassesArray().includes(e))
  }

  checkBypasses (message) {
    const bypassids = []
    bypassids.push(message.author.id)
    bypassids.push(message.channel.id)
    Array.from(message.member.roles.cache.map(r => r.id.toString())).forEach(e => { bypassids.push(e) })

    return this.bypass(bypassids)
  }

  checkBypass (bypassid, type) {
    if (this.validTypes.includes(type)) return this.dba.findBypass(bypassid, type)
    else throw new Error('Invalid Bypass Type')
  }

  getAllBypassesSorted () {
    const bps = this.getAllBypasses()
    const obj = { USER: [], ROLE: [], CHANNEL: [] }
    bps.forEach(e => {
      obj[e.type].push(e.id)
    })
    return obj
  }
}
