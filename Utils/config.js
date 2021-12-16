export default{
    /**
     * Stores the config options (Could have used JSON but not ES6 Import compatible)
     */
    "BOTNAME" : "Zeus Bot",
    "PREFIX" : ">",
    "ALLOWED_CHANNELS" : ["902198800624521257","902198909676441680","915558303189327882"],
    "DEV_MODE" : true,
    "DEV_OPTIONS" : {
        "REMOVE_DB_ON_START" : true
    },
    "DATABASE_CONFIG": {
        "DATABASE_FOLDER" : "./db/",
        "BACKUP_FOLDER" : "./db-backups/",
        "DATABASE_NAME" : "db-zeus.db",
        "TABLES"  :{
            "TABLE_LOGS" : {
                "name"  : "zeus-log",
                "schema" : {
                    "id" : "INT",
                    "message" : "TEXT"
                }
            },
            "TABLE_CONFIG" : {
                "name" : "zeus-config",
                "schema" : {
                    "name" : "TEXT",
                    "value" : "TEXT"
                },
                "default":[
                    {"name" : "threashold", "value": "0.6"}
                ]
            },
            "TABLE_PERMMISSIONS" : {
                "name" : "zeus-permissions",
                "schema" : {
                    "id" : "TEXT",
                    "value" : "INT"
                },
                "default" : [
                    {"id" : "148530891679858688" , "value": 4}
                ]
            },
            "TABLE_BYPASSES" : {
                "name" : "zeus-bypasses",
                "schema" : {
                    "id" : "TEXT",
                    "type" : "TEXT"
                }
            }
        }
    }
}