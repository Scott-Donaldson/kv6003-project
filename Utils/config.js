export default{
    /**
     * Stores the config options (Could have used JSON but not ES6 Import compatible)
     */
    "PREFIX": ">",
    "ALLOWED_CHANNELS": ["902198800624521257","902198909676441680","915558303189327882"],
    "DEV_MODE": true,
    "DATABASE_CONFIG": {
        "DATABASE_FOLDER" : "./",
        "BACKUP_FOLDER" : "./db-backups/",
        "DATABASE_NAME" : "db-zeus.db",
        "TABLES":{
            "TABLE_LOGS" : {
                "name": "zeus-log",
                "schema": {
    
                }
            },
            "TABLE_CONFIG" : {
                "name": "zeus-config",
                "schema": {
                    
                },
                "default":{
    
                }
            },
            "TABLE_PERMMISSIONS" : {
                "name":"zeus-permissions",
                "schema": {
                    
                }
            },
            "TABLE_BYPASSES" : {
                "name":"zeus-bypasses",
                "schema": {
                    
                }
            }
        }
    }
}