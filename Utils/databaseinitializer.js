import config from "./config.js";
import fs from 'fs'
import MessageHandler from './messagehandler.js'
import DatabaseConnection from "./databaseconnection.js";

export default class DatabaseInitializer {
    constructor() {
        if(config.DEV_OPTIONS.REMOVE_DB_ON_START && config.DEV_MODE) this.removeDatabaseFiles()
        if(!this.doesDatabaseExist()) this.createDatabaseFile()

        this.database = new DatabaseConnection()
        this.connection = this.database.getConnection()

        this.createRequiredTables()
    }
    /**
     * @returns SQLITE Database Connection
     */
    getConnection = () => {
        return this.connection
    }
    /**
     * Removes the database file defined by its location and name in the config file
     */
    removeDatabaseFiles = () => {
        if (config.DEV_MODE) MessageHandler.log('console', "[ DEV ] Removing previous DB file")
        let databaseLocation = config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME
        if (fs.existsSync(databaseLocation)) fs.unlinkSync(databaseLocation)
    }
    /**
     * Creates the database file and file system defined in the config file
     */
    createDatabaseFile = () => {
        if (config.DEV_MODE) MessageHandler.log('console', "[ INI ] Creating Database")
        this.createDatabaseFolder()
        fs.writeFileSync(DatabaseConnection.getDatabaseName(), "", (err) => {
            if (err) throw err
            if (config.DEV_MODE) MessageHandler.log('console', "[ INI ] Database File Created")
        })
    }
    /**
     * Creates a Folder for the database file to be stored in defined by the config file
     */
    createDatabaseFolder = () => {
        if (!fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER)) fs.mkdirSync(config.DATABASE_CONFIG.DATABASE_FOLDER)
    }
    /**
     * Checks to see if the SQLITE Database file exists in its expected location
     * @returns Boolean
     */
    doesDatabaseExist = () => {
        return fs.existsSync(config.DATABASE_CONFIG.DATABASE_FOLDER + config.DATABASE_CONFIG.DATABASE_NAME)
    }
    /**
     * Checks the SQLITE Database to see if a table exists
     * @param {String} table 
     * @returns Boolean
     */
    doesTableExist = table => {
        let sql = "SELECT count(*) from sqlite_master WHERE type = 'table' AND name = ':table_name'"
        return (this.connection.prepare(sql).get({table_name: table}) > 0)
    }
    /**
     * Creates a table based with a name and colums defined in the config file
     * @param {String} tableName 
     * @param {Object} tableColumns 
     */
    createTable = (tableName, tableColumns) => {
        let tableString = `CREATE TABLE IF NOT EXISTS '${tableName}'`
        tableString += this.generateFromSchema(tableColumns)
        this.connection.exec(tableString)
    }
    /**
     * Converts Config Object definition for table into SQL compatible string
     * @param {Object} tableColumns 
     * @returns String
     */
    generateFromSchema = tableColumns => {
        let columns = []
        for (const [columnName, columnType] of Object.entries(tableColumns)) {
            columns.push(`${columnName.toLowerCase()} ${columnType.toUpperCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    /**
     * Converts Config Object definition for table into SQL compatible string without the Type Attribute
     * @param {Object} tableColumns 
     * @returns String
     */
    generateFromSchemaWithoutType = tableColumns => {
        let columns = []
        for (const [columnName, columnType] of Object.entries(tableColumns)) {
            columns.push(`${columnName.toLowerCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    /**
     * Converts Config Object definition for table into SQL compatible string without type attribute but with optional prefix per column
     * @param {Object} tableColumns 
     * @returns String
     */
    generateFromSchemaWithoutTypeWithCharPrefix = (tableColumns, charPrefix) => {
        let columns = []
        for (const [columnName, columnType] of Object.entries(tableColumns)) {
            columns.push(`${charPrefix}${columnName.toLowerCase()}`)
        }
        return " ( " + columns.join(", ") + " )"
    }
    /**
     * Creates the required tables defined in the config file
     */
    createRequiredTables = () => {
        if (config.DEV_MODE) MessageHandler.log('console', "[ INI ] Creating Required Tables")
        this.getTableNames().forEach(e => {
            if (!this.doesTableExist(e)) {
                let a = this.findTable(e)
                this.createTable(a.name, a.schema)
                if (this.doesTableHaveDefault(e)) this.populateTableWithDefault(a.name, a.default)
            }
        })
    }
    /**
     * If the config specifies table defaults, this will populate the table with those defaults on the first execution if they are missing
     * @param {String} tableName 
     * @param {Object} defaults 
     */
    populateTableWithDefault = (tableName, defaults) => {
        let sql = `INSERT INTO '${tableName}' ${this.generateFromSchemaWithoutType(this.findTable(tableName).schema)} VALUES ${this.generateFromSchemaWithoutTypeWithCharPrefix(this.findTable(tableName).schema, "@")}`
        let insert = this.connection.prepare(sql)

        let populateTable = this.connection.transaction(items => {
            for (const item of items) {
                insert.run(item)
            }
        })
        populateTable(defaults)
    }
    /**
     * Returns a Config Table Object based on its name
     * @param {String} tableName 
     * @returns Object
     */
    findTable = tableName => {
        let tables = config.DATABASE_CONFIG.TABLES
        for (const [x, tableValues] of Object.entries(tables)) {
            if (tableValues.name.toLowerCase() === tableName.toLowerCase()) return tableValues
        }
        return false
    }
    /**
     * Returns all the table names specified in the config table
     * @returns String[]
     */
    getTableNames = () => {
        let tables = config.DATABASE_CONFIG.TABLES
        let output = []
        for (const [x, tableValues] of Object.entries(tables)) output.push(tableValues.name)
        return output
    }
    /**
     * Checks to see if a table config has defaults that need to be entered
     * @param {String} tableName 
     * @returns Boolean
     */
    doesTableHaveDefault = tableName => {
        return ("default" in this.findTable(tableName))
    }
    /**
     * Creates a backup of the database
     */
    createBackup = () => {
        let databaseName = config.DATABASE_CONFIG.DATABASE_NAME
        let backupFolder = config.DATABASE_CONFIG.BACKUP_FOLDER
        let backupName = `${databaseName.substring(0, databaseName.length - 3 )}-backup-${Date.now()}`
        this.connection.backup(backupFolder + backupName)
    }
}