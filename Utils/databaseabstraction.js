import DatabaseConnection from "./databaseconnection.js";
import config from "./config.js";
import fs from 'fs'
import MessageHandler from './messagehandler.js'

export default class DatabaseAbstraction {
    constructor(){
        if(config.DEV_OPTIONS.REMOVE_DB_ON_START) this.removeDatabaseFiles()
        if(!this.doesDatabaseExist()) this.createDatabaseFile()

        this.database = new DatabaseConnection()
        this.connection = this.database.getConnection()

        this.createRequiredTables()
    }
    removeDatabaseFiles = () => {
        if(config.DEV_MODE) MessageHandler.log('console', "[ DEV ] Removing previous DB file")
        let databaseLocation = config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
        if(fs.existsSync(databaseLocation)) fs.unlinkSync(databaseLocation)
    }
    createDatabaseFile = () => {
        if(config.DEV_MODE) MessageHandler.log('console', "[ INI ] Creating Database")
        this.createDatabaseFolder()
        fs.writeFileSync(DatabaseConnection.getDatabaseName(), "", (err) => {
            if(err) throw err
            if(config.DEV_MODE) MessageHandler.log('console', "[ INI ] Database File Created")
        })
    }
    createDatabaseFolder = () => {
        if(!fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER)) fs.mkdirSync(config.DATABASE_CONFIG.DATABASE_FOLDER)
    }
    doesDatabaseExist = () => {
        return fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME)
    }
    doesTableExist = table => {
        let sql = "SELECT count(*) from sqlite_master WHERE type = 'table' AND name = ':table_name'"
        return (this.connection.prepare(sql).get({table_name: table}) > 0)
    }
    createTable = (tableName, tableColumns) => {
        let tableString = `CREATE TABLE IF NOT EXISTS '${tableName}'`
        tableString += this.generateFromSchema(tableColumns)
        this.connection.exec(tableString)
    }
    generateFromSchema = tableColumns => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${columnName.toLowerCase()} ${columnType.toUpperCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    generateFromSchemaWithoutType = tableColumns => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${columnName.toLowerCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    generateFromSchemaWithoutTypeWithCharPrefix = (tableColumns, charPrefix) => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${charPrefix}${columnName.toLowerCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    createRequiredTables = () => {
        if(config.DEV_MODE) MessageHandler.log('console', "[ INI ] Creating Required Tables")
        this.getTableNames().forEach( e => {
            if(!this.doesTableExist(e)){
                let a = this.findTable(e)
                this.createTable(a.name, a.schema)
                if(this.doesTableHaveDefault(e)) this.populateTableWithDefault(a.name, a.default)
            }
        })
    }
    populateTableWithDefault = (tableName, defaults) => {
        let sql = `INSERT INTO '${tableName}' ${this.generateFromSchemaWithoutType(this.findTable(tableName).schema)} VALUES ${this.generateFromSchemaWithoutTypeWithCharPrefix(this.findTable(tableName).schema, "@")}`
        let insert = this.connection.prepare(sql)

        let populateTable = this.connection.transaction(items =>{
            for(const item of items) {
                insert.run(item)
            }
        })
        populateTable(defaults)
    }
    findTable = tableName => {
        let tables = config.DATABASE_CONFIG.TABLES
        for(const [x, tableValues] of Object.entries(tables)){
            if(tableValues.name.toLowerCase() === tableName.toLowerCase()) return tableValues
        }
        return false
    }
    getTableNames = () => {
        let tables = config.DATABASE_CONFIG.TABLES
        let output = []
        for(const [x, tableValues] of Object.entries(tables)) output.push(tableValues.name)
        return output
    }
    doesTableHaveDefault = tableName => {
        return ("default" in this.findTable(tableName))
    }
    createBackup = () => {
        let databaseName = config.DATABASE_CONFIG.DATABASE_NAME
        let backupFolder = config.DATABASE_CONFIG.BACKUP_FOLDER
        let backupName = `${databaseName.substring(0, databaseName.length - 3 )}-backup-${Date.now()}`
        this.connection.backup(backupFolder + backupName)
    }
}