import config from'./config.js'
import Database from 'better-sqlite3'

export default class DatabaseConnection {
    constructor(){
        this.databaseFile = DatabaseConnection.getDatabaseName()
        this.connection = this.createConnection(this.databaseFile)
    }

    createConnection = async databaseName => {
        return new Database(databaseName)
    }

    getConnection = () => this.connection

    static getDatabaseName = () => config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
    
}