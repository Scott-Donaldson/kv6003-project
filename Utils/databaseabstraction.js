import config from './config.js'
import DatabaseManager from './databasemanager.js'
/**
 * @todo
 * create DatabaseManager Class that handles backups and the DatabaseInitializer Class
 */
export default class DatabaseAbstraction {
  constructor () {
    this.dbm = new DatabaseManager()
    this.connection = this.dbm.getConnection()
  }

  getClassifierThreashold () {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name}' WHERE name = ?`
    return parseFloat(this.connection.prepare(sql).get('threashold').value)
  }

  getStatCount (stat) {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_STATS.name}' WHERE statistic = ?`
    return parseInt(this.connection.prepare(sql).get(stat).value)
  }

  getRowCount (table) {
    const sql = `SELECT COUNT(*) from '${table}'`
    const data = this.connection.prepare(sql).get()
    const res = data[Object.keys(data)[0]]
    return res
  }

  incrementCount (stat) {
    const current = this.getStatCount(stat)
    const sql = `UPDATE '${config.DATABASE_CONFIG.TABLES.TABLE_STATS.name}' SET value = ${current + 1} WHERE statistic = ?`
    this.connection.prepare(sql).run(stat)
  }

  logUserMessage (message, uid, timestampISO) {
    const sql = `INSERT INTO '${config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.name}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.schema, '@')}`
    const statement = this.connection.prepare(sql)
    statement.run({
      id: this.getRowCount(config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.name) + 1,
      uid: uid,
      message: message,
      timestamp: timestampISO
    })
  }

  logSystemMessage (type, message) {
    const sql = `INSERT INTO '${config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.name}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.schema, '@')}`
    const statement = this.connection.prepare(sql)
    const timestamp = new Date()
    statement.run({
      id: this.getRowCount(config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.name) + 1,
      type: type.toUpperCase(),
      message: message,
      timestamp: timestamp.toISOString()
    })
  }
}
