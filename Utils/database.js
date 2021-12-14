import config from'./config.js'

class Database {
    constructor(){
        this.databaseFile = Database.getDatabaseName()
        this.connection = this.createConnection(this.databaseFile)
    }

    createConnection = databaseName => {
        return require('better-sqlite3')(databaseName)
    }

    getConnection = () => this.connection

    static getDatabaseName = () => {
        return config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
    }
}
export {Database}
