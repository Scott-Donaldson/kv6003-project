import DatabaseConnection from "./databaseconnection.js";
import config from "./config.js";
import fs from 'fs'

export default class DatabaseAbstraction {
    constructor(){
        if(config.DEV_OPTIONS.REMOVE_DB_ON_START) this.removeDatabaseFiles()
        if(!this.doesDatabaseExist()) this.createDatabaseFile()

        this.database = new DatabaseConnection()
        this.connection = this.database.getConnection()

        this.createRequiredTables()
        this.populateTablesWithDefaults()
    }
    removeDatabaseFiles = () => {
        if(config.DEV_MODE) console.log("[ DEV ] Removing previous DB file")
        let databaseLocation = config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
        if(fs.existsSync(databaseLocation)) fs.unlinkSync(databaseLocation)
    }
    createDatabaseFile = () => {
        if(config.DEV_MODE) console.log("[ INI ] Creating Database")
        this.createDatabaseFolder()
        fs.writeFileSync(DatabaseConnection.getDatabaseName(), "", (err) => {
            if(err) throw err
            if(config.DEV_MODE) console.log("[ INI ] Database File Created")
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
        let tableString = `CREATE TABLE IF NOT EXISTS ${tableName}`
        tableString += this.generateFromSchema(tableColumns)
        console.log(tableString)
        this.connection.exec(tableString)
    }
    generateFromSchema = tableColumns => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${columnName.toLowerCase} ${columnType.toUpperCase()}`)
        }
        return "(" + columns.join(", ") + ")"
    }
    generateFromSchemaWithoutType = tableColumns => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${columnName.toLowerCase}`)
        }
        return "(" + columns.join(", ") + ")"
    }
    generateFromSchemaWithoutTypeWithCharPrefix = (tableColumns, charPrefix) => {
        let columns = []
        for( const [columnName, columnType] of Object.entries(tableColumns) ){
            columns.push(`${charPrefix}${columnName.toLowerCase}`)
        }
        return "(" + columns.join(", ") + ")"
    }
    createRequiredTables = () => {
        if(config.DEV_MODE) console.log("[ INI ] Creating Required Tables")
        let tableNames = this.getTableNames()
        tableNames.forEach( e => {
            if(!this.doesTableExist(e)){
                let a = this.findTable(e)
                this.createTable(a.name, a.schema)
            }
        })
    }
    populateTablesWithDefaults = () => {
        if(config.DEV_MODE) console.log("[ INI ] Populating Tables with default values")
        this.getTableNames.forEach( e => {
            if(this.doesTableHaveDefault(e)) this.populateTableWithDefault(e.name, e.default)
        })
    }
    populateTableWithDefault = (tableName, defaults) => {
        let sql = `INSERT INTO ${tableName} ${this.generateFromSchemaWithoutType(this.findTable(tableName).schema)} VALUES ${this.generateFromSchemaWithoutTypeWithCharPrefix(this.findTable(tableName).schema, "@")}`
        let insert = this.connection.prepare(sql)

        let populateTable = this.connection.transaction(items =>{
            for(const item of items) insert.run(item)
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
        return ("schema" in this.findTable(tableName))
    }
    createBackup = () => {
        let databaseName = config.DATABASE_CONFIG.DATABASE_NAME
        let backupFolder = config.DATABASE_CONFIG.BACKUP_FOLDER
        let backupName = `${databaseName.substring(0, databaseName.length - 3 )}-backup-${Date.now()}`
        this.connection.backup(backupFolder + backupName)
    }
}