import DatabaseAbstraction from './databaseabstraction.js'
// const populateTableWithDefault = tableName => {
//     console.log(findTable(tableName))
//     // let table = config.DATABASE_CONFIG.TABLES[tableName].name
//     // let defaults = config.DATABASE_CONFIG.TABLES[tableName].defaults

//     // const insertDefaults = this.connection.transaction(defaultItems => {
//     //     for(const item of Object.entries(defaultItems)) console.log({
//     //         name: item.name,
//     //         value: item.value
//     //     })
//     // })
//     // insertDefaults(defaults)
// }


let db = new DatabaseAbstraction()