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
}
