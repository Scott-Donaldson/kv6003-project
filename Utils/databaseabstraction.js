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
    const sql = 'SELECT COUNT(*) from ?'
    return parseInt(this.connection.prepare(sql).get(table))
  }

  incrementCount (stat) {
    const current = this.getStatCount(stat)
    const sql = `UPDATE ${config.DATABASE_CONFIG.TABLES.TABLE_STATS.name} SET value = ${current + 1} WHERE statistic = ?`
    this.connection.prepare(sql).run(stat)
  }
}
