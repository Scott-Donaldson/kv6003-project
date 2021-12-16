import config from "./config.js";
import DatabaseInitializer from "./databaseinitializer.js";
/**
 * @todo
 * create DatabaseManager Class that handles backups and the DatabaseInitializer Class
 */
export default class DatabaseAbstraction {
    constructor(){
        this.dbi = new DatabaseInitializer()
        this.connection = this.dbi.getConnection()
    }
   
    getClassifierThreashold = () => {
        let sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name}' WHERE name = ?`
        return parseFloat(this.connection.prepare(sql).get("threashold").value)
    }
}