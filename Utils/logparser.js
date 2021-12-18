export default class LogParser {
  static messageCountOutput (messages) {
    return (messages.length > 0) ? `${messages.length} Log Entries` : 'No Log Entries'
  }
}
