import config from './config.js'
import Database from 'better-sqlite3'

export default class DatabaseConnection {
  getConnection () {
    const database = new Database(DatabaseConnection.getDatabaseName())
    return database
  }

  static getDatabaseName () {
    return config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
  }
}
