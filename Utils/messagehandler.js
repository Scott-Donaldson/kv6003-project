import * as Discord from 'discord.js'
/**
 * Author W19019810
 * MessageHandler provides a bunch of static methods to parse different types of methods into specific output types
 */
export default class MessageHandler {
  /**
     * Outputs results
     * Takes type
     * @param {Classifier.resultObject} res Discord.MessageEmbed
     * @param {String} type "text" | "embed" | "object"
     */
  static outputResults (res, type) {
    switch (type.toLowerCase()) {
      case 'text':
        break
      case 'embed':
        return this.embedParser(res)
      case 'object':
        break
      default:
        throw new Error('Invalid output type')
    }
  }

  /**
     * Converts Classifier Result Object into Discord Rich Embed
     * @param {Object}
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed
     */
  static embedParser (params = {}) {
    const res = params.res
    const message = params.message
    if (!res) throw new Error('No resultsObject received')

    if (res.message.length > 256) res.message = res.message.slice(0, 256) + '...'
    const embed = new Discord.MessageEmbed()

    let messageContent = 'Message Flagged! \n'
    Object.keys(res.results).forEach(e => {
      messageContent += res.results[e] ? `${e}\n` : ''
    })

    embed.setTitle(params.title)
    embed.setDescription(messageContent)
    embed.addField('Info', `Execution Time: ${res.executionTime.seconds}s ${res.executionTime.milliseconds}ms\nMessage: ${res.message}\nLink: ${message.url}\nPing: ${params.role}`, true)
    embed.setTimestamp()
    return embed
  }

  /**
     * System Message Log Handler
     * @param {String} type "console" | "text"
     * @param {String} text
     */
  static log (type, message, params = {}) {
    switch (type.toLowerCase()) {
      case 'console':
        this.outputToConsole(message)
        break
      case 'channel':
        if ('channel' in params) this.outputToChannel(message, params.channel)
        else throw new Error('Cannot find channel')
        break
      default:
        throw new Error('No log type specified')
    }
  }

  /**
     * Outputs Message to Console
     * @param {String} message
     */
  static outputToConsole (message) {
    console.log(message)
  }

  /**
     * Sends a string message to a channel
     * @param {String} message
     * @param {Discord.Channel} channel
     */
  static outputToChannel (message, channel) {
    channel.send(message)
  }

  /**
     * Creates a basic discord rich embed and returns the object
     * @param {Object} params : {title: String, description: String}
     * @returns {Discord.MessageEmbed}
     */
  static basicEmbed (params = {}) {
    const embed = new Discord.MessageEmbed()
    if ('title' in params) embed.setTitle(params.title)
    if ('description' in params) embed.setDescription(params.description)
    if ('footer' in params) embed.setFooter(params.footer)
    if ('timestamp' in params && params.timestamp === true) embed.setTimestamp()
    if ('colour' in params) embed.setColor(params.colour)
    return embed
  }

  /**
     * Edits a discord rich embed
     * @param {Object} params : {oldMessage: Discord.Message, newMessage: Discord.MessageEmbed}
     */
  static editEmbed (params = {}) {
    if ('oldMessage' in params === false) throw new Error('No message to edit')
    if ('newMessage' in params === false) throw new Error('No message to update')
    params.oldMessage.edit({ embeds: [params.newMessage] })
  }

  /**
     *
     * @param {Object} params : {message: Discord.MessageEmbed, channel: Discord.Channel}
     * @returns
     */
  static sendEmbed (params = {}) {
    if ('message' in params === false) throw new Error('No message to send')
    if ('channel' in params === false) throw new Error('No channel to send message to')
    return new Promise(resolve => {
      params.channel.send({ embeds: [params.message] }).then(message => resolve(message))
    })
  }

  static totalPageHelper (logEntries) {
    if (logEntries.length === 0) return 1
    else return logEntries.length
  }

  static logToStr (logEntries) {
    const logs = (logEntries.length > 0) ? logEntries : [{ message: 'No Entries' }]
    let logString = ''
    logs.forEach(e => {
      for (const [logParam, logMessage] of Object.entries(e)) logString += `**${logParam}:** ${logMessage}\n`
    })
    return logString + '\n\n'
  }

  static generatePaginationEmbeds (params = {}) {
    const entriesPerPage = 5
    const totalPages = Math.ceil(this.totalPageHelper(params.entries) / entriesPerPage)
    let page = 1
    const embeds = []
    while (page <= totalPages) {
      const end = page * entriesPerPage
      const start = end - entriesPerPage
      const pageEntries = params.entries.slice(start, end)
      const title = `${params.title} Logs`
      const description = `${this.logToStr(pageEntries)}`
      const footer = `Page ${page} of ${totalPages}`
      embeds.push(this.basicEmbed({
        title: title,
        description: description,
        footer: footer,
        timestamp: true
      }))
      page++
    }
    return embeds
  }

  static paginationEmbedHandler (params = {}) {
    const emojiNext = '➡'
    const emojiPrev = '⬅'
    const emojiStop = '🛑'
    const allowedReactions = [emojiPrev, emojiNext, emojiStop]
    const embeds = this.generatePaginationEmbeds({
      title: params.title,
      entries: params.entries
    })
    const timeoutTime = 1000 * 60 * 60 // 1 Hour Timeout
    const getEmbed = i => {
      return embeds[i]
    }
    const filter = (reaction, user) => { return (!user.bot) && (allowedReactions.includes(reaction.emoji.name)) && (user.id === params.invokerUid) }

    const onCollect = (emoji, message, page, getEmbed, collector) => {
      if (page < 0) page = 0
      if (page > embeds.length - 1) page = embeds.length - 1

      if (emoji.name === emojiPrev) {
        const embed = getEmbed(page - 1)
        if (embed !== undefined) {
          message.edit({ embeds: [getEmbed(--page)] })
        }
      } else if (emoji.name === emojiNext) {
        const embed = getEmbed(page + 1)
        if (embed !== undefined) {
          message.edit({ embeds: [getEmbed(++page)] })
        }
      } else if (emoji.name === emojiStop) {
        collector.stop()
      }
      return page
    }

    const createCollectorMessage = (message, getEmbed) => {
      let page = 0
      const collector = message.createReactionCollector({ filter, time: timeoutTime })
      collector.on('collect', async (r, u) => {
        page = onCollect(r.emoji, message, page, getEmbed, collector)
        if (r.emoji.name !== emojiStop) r.users.remove(u.id)
      })

      collector.on('end', () => {
        message.delete()
      })
    }

    const sendPaginationMessage = (channel, getEmbed) => {
      channel.send({ embeds: [getEmbed(0)] })
        .then(msg => {
          msg.react(emojiPrev)
          msg.react(emojiNext)
          msg.react(emojiStop)
          createCollectorMessage(msg, getEmbed)
        })
    }

    sendPaginationMessage(params.channel, getEmbed)
  }

  static missingPermission (channel, permission) {
    const embed = this.basicEmbed({
      title: 'Missing Permission',
      description: `User missing ${permission} permission`
    })
    this.sendEmbed({
      channel: channel,
      message: embed
    }).then(msg => {
      msg.delete(5_000)
    })
  }

  static generatePermissionEmbed (title, permissionArray, userPermissionArray, emojiArray) {
    if (permissionArray.length !== emojiArray.length) throw new Error('Array lengths do not match')

    const embed = new Discord.MessageEmbed()

    let description = ''
    for (let i = 0; i < permissionArray.length; i++) {
      description += `${emojiArray[i]} | ${permissionArray[i]} : ${userPermissionArray.includes(permissionArray[i]) ? 'True' : 'False'}\n`
    }

    embed.setTitle(title)
    embed.setDescription(description)
    embed.setTimestamp()

    return embed
  }

  static displayUserPermissions (params = {}) {
    const emoji = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣']
    const emojiStop = '🛑'
    const embed = this.generatePermissionEmbed('User Permissions', params.allPermissions, params.userPermissions, emoji)
    const timeoutTime = 1000 * 60 * 60
    const filter = (reaction, user) => {
      return (!user.bot) &&
      (emoji.includes(reaction.emoji.name) || reaction.emoji.name === emojiStop) &&
      (user.id === params.invokerUid) &&
      (params.userHasPermission || params.adminUser)
    }

    const onCollect = (clickedEmoji, collector, message) => {
      const idx = emoji.indexOf(clickedEmoji.name)
      if (clickedEmoji.name === emojiStop) collector.stop()
      else {
        if (params.allPermissions[idx] === 'ADMINISTRATOR' && params.adminUser) {
          params.pm.toggleUserPermission(params.permissionUid, 'ADMINSTRATOR')
        } else {
          params.pm.toggleUserPermission(params.permissionUid, params.allPermissions[idx])
        }
        message.edit({ embeds: [this.generatePermissionEmbed('User Permissions', params.allPermissions, params.pm.getUserPermissions(params.permissionUid), emoji)] })
      }
    }

    const createCollectorMessage = (message) => {
      const collector = message.createReactionCollector({ filter, time: timeoutTime })
      collector.on('collect', async (r, u) => {
        onCollect(r.emoji, collector, message)
        if (r.emoji.name !== emojiStop) r.users.remove(u.id)
      })

      collector.on('end', async () => {
        message.delete()
      })
    }

    const sendEmbed = (channel, embed) => {
      channel.send({ embeds: [embed] })
        .then(msg => {
          emoji.forEach(e => {
            msg.react(e)
          })
          msg.react(emojiStop)
          createCollectorMessage(msg)
        })
    }
    sendEmbed(params.channel, embed)
  }

  static generateActionsEmbed (title, allActions, setActions, emoji) {
    if (setActions.length <= 0) setActions.push('')

    if (allActions.length !== emoji.length) throw new Error('Array lengths do not match')
    const embed = new Discord.MessageEmbed()

    let description = ''
    for (let i = 0; i < allActions.length; i++) {
      description += `${emoji[i]} | ${allActions[i]} : ${setActions.includes(allActions[i]) ? 'True' : 'False'}\n`
    }

    embed.setTitle(title)
    embed.setDescription(description)
    embed.setTimestamp()

    return embed
  }

  static displayBotActions (params = {}) {
    const emoji = ['🔴', '🟠', '🟡']
    const emojiStop = '🛑'
    const embed = this.generateActionsEmbed('Bot Actions', params.allActions, params.setActions, emoji)
    const timeoutTime = 1000 * 60 * 60

    const filter = (reaction, user) => {
      return (!user.bot) &&
      (emoji.includes(reaction.emoji.name) || reaction.emoji.name === emojiStop) &&
      (user.id === params.invokerUid) &&
      (params.userHasPermission || params.adminUser)
    }

    const onCollect = (clickedEmoji, collector, message) => {
      const idx = emoji.indexOf(clickedEmoji.name)
      if (clickedEmoji.name === emojiStop) collector.stop()
      else {
        params.am.toggleAction(params.allActions[idx])
        message.edit({ embeds: [this.generateActionsEmbed('Bot Actions', params.allActions, params.am.getSetActions(), emoji)] })
      }
    }

    const createCollectorMessage = (message) => {
      const collector = message.createReactionCollector({ filter, time: timeoutTime })
      collector.on('collect', (r, u) => {
        onCollect(r.emoji, collector, message)
        if (r.emoji.name !== emojiStop) r.users.remove(u.id)
      })

      collector.on('end', async () => {
        message.delete()
      })
    }

    const sendEmbed = (channel, embed) => {
      channel.send({ embeds: [embed] })
        .then(msg => {
          emoji.forEach(e => {
            msg.react(e)
          })
          msg.react(emojiStop)
          createCollectorMessage(msg)
        })
    }

    sendEmbed(params.channel, embed)
  }
}
