import Database from "./database.js";
import config from "./config.js";
import fs from 'fs'

class DatabaseAbstraction {
    constructor(){
        if(!this.doesDatabaseExist) this.createDatabaseFile()
        this.connection = new Database().getConnection()
    }
    createDatabaseFile = () => {
        fs.writeFileSync(Database.getDatabaseName())
    }
    doesDatabaseExist = () => {
        return fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME)
    }
    doesTableExist = table => {
        let sql = "SELECT count(*) from sqlite_master WHERE type = 'table' AND name = :table_name"
        return (this.connection.prepare(sql).get({table_name: table}) > 0)
    }
    createTable = (tableName, tableColumns) => {
        let tableString = `CREATE TABLE IF NOT EXISTS ${tableName} (`

        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns)){
            columns.push(`${columnName} ${columnType.toUpperCase()}`)
        }

        tableString += columns.join(", ") + ")"

        this.connection.exec(tableString)
    }

    initializeDatabase = () => {
        let tables = config.DATABASE_CONFIG.TABLES
        for(const [tableName, tableConfig] of Object.entries(tables)) this.createTable(tableConfig.name, tableConfig.schema)
    }
    populateTablesWithDefaults = () => {
        let tables = config.DATABASE_CONFIG.TABLES
        for(const [tableName, tableDefault] of Object.entries(tables))  return
    }
    populateTableWithDefault = tableName => {
        // REWRITE WITH FIND TABLE
    }
    findTable = tableName => {
        let tables = config.DATABASE_CONFIG.TABLES
        for(const [x, tableValues] of Object.entries(tables)){
            if(tableValues.name.toLowerCase() === tableName.toLowerCase()) return tableValues
        }

    }
    createBackup = () => {

    }
}

export{DatabaseAbstraction}