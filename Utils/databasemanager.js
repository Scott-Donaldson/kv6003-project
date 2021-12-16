import DatabaseInitializer from './databaseinitializer.js'
import fs from 'fs'
import config from './config.js'

export default class DatabaseManager {
  constructor () {
    this.dbi = new DatabaseInitializer()
    this.connection = this.dbi.getConnection()
  }

  getDBI () {
    return this.dbi
  }

  getConnection () {
    return this.connection
  }

  createBackup () {
    this.createBackupFolder()
    const databaseName = config.DATABASE_CONFIG.DATABASE_NAME
    const backupFolder = config.DATABASE_CONFIG.BACKUP_FOLDER
    const backupName = `${databaseName.substring(0, databaseName.length - 3)}-backup-${Date.now()}`
    this.connection.backup(backupFolder + backupName)
  }

  createBackupFolder () {
    if (!fs.existsSync(config.DATABASE_CONFIG.BACKUP_FOLDER)) fs.mkdirSync(config.DATABASE_CONFIG.BACKUP_FOLDER)
  }
}
