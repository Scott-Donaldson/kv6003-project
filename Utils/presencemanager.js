export default class PresenceManager {
  constructor (connection, client) {
    this.dba = connection
    this.client = client
  }

  getRandom () {
    const arr = this.getAll()
    return arr[Math.floor(Math.random() * arr.length)]
  }

  getAll () {
    return this.dba.getAllPresences()
  }

  changeOnInterval (interval) {
    setInterval(() => {
      this.client.user.setPresence({ activities: [this.getRandom()] })
    }, interval)
  }
}
