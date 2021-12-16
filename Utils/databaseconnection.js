import config from'./config.js'
import Database from 'better-sqlite3'

export default class DatabaseConnection {
    
    getConnection = () => new Database(DatabaseConnection.getDatabaseName())

    static getDatabaseName = () => config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
    
}