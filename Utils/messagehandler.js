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
     * @param {Classifier.resultObject} res
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed
     */
  static embedParser (res) {
    if (!res) throw new Error('No resultsObject received')

    if (res.message.length > 256) res.message = res.message.slice(0, 256) + '...'
    const embed = new Discord.MessageEmbed()

    let messageContent = 'Message Flagged! \n'
    Object.keys(res.results).forEach(e => {
      messageContent += res.results[e] ? `${e}\n` : ''
    })

    embed.setTitle('Message Detection')
    embed.setDescription(messageContent)
    embed.addField('Info', `Execution Time: ${res.executionTime.seconds}s ${res.executionTime.milliseconds}ms\nMessage: ${res.message}`, true)
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

  static logParser (logEntries) {
    return (logEntries.length <= 0) ? ['No Entries'] : logEntries
  }

  static generatePaginationEmbeds (params = {}) {
    const entriesPerPage = 10
    const totalPages = Math.ceil(params.entries.length / entriesPerPage)
    let page = 0
    const embeds = []
    while (page <= totalPages) {
      const start = page
      const end = page * entriesPerPage
      const pageEntries = params.entries.slice(start, end)
      const title = `${params.title} Logs`
      const description = `${pageEntries.join('\n')}`
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
    const allowedReactions = [emojiPrev, emojiNext]
    const embeds = this.generatePaginationEmbeds({
      title: params.title,
      entries: params.entries
    })
    const timeoutTime = 30 * 1000
    const getEmbed = i => {
      return embeds[i]
    }
    const filter = (reaction, user) => { return (!user.bot) && (allowedReactions.includes(reaction.emoji.name)) }

    const onCollect = (emoji, message, page, getEmbed) => {
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
      }
      return page
    }

    const createCollectorMessage = (message, getEmbed) => {
      let page = 0
      const collector = message.createReactionCollector({ filter, time: timeoutTime })
      collector.on('collect', async (r, u) => {
        page = onCollect(r.emoji, message, page, getEmbed)
        r.users.remove(u.id)
      })
    }

    const sendPaginationMessage = (channel, getEmbed) => {
      channel.send({ embeds: [getEmbed(0)] })
        .then(msg => msg.react(emojiPrev))
        .then(msgReaction => msgReaction.message.react(emojiNext))
        .then(msgReaction => createCollectorMessage(msgReaction.message, getEmbed))
    }

    sendPaginationMessage(params.channel, getEmbed)
  }
}
