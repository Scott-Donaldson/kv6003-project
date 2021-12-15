import Database from "./database.js";
import config from "./config.js";
import fs from 'fs'

export class DatabaseAbstraction {
    constructor(){
        if(!this.doesDatabaseExist) this.createDatabaseFile()
        this.connection = new Database().getConnection()
    }
    createDatabaseFile = () => {
        fs.writeFileSync(Database.getDatabaseName())
        this.createRequiredTables()
        this.populateTablesWithDefaults()
    }
    doesDatabaseExist = () => {
        return fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME)
    }
    doesTableExist = table => {
        let sql = "SELECT count(*) from sqlite_master WHERE type = 'table' AND name = :table_name"
        return (this.connection.prepare(sql).get({table_name: table}) > 0)
    }
    createTable = (tableName, tableColumns) => {
        let tableString = `CREATE TABLE IF NOT EXISTS ${tableName}`
        tableString += this.generateFromSchema(tableColumns)
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
        this.getTableNames.forEach( e => {
            if(!this.doesTableExist(e.name)){
                let a = this.findTable(e)
                this.createTable(a.name, a.schema)
            }
        })
    }
    populateTablesWithDefaults = () => {
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