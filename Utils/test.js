import config from './config.js'
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

const findTable = tableName => {
    let tables = config.DATABASE_CONFIG.TABLES
    let found = null
    Object.entries(tables).forEach( e => {
        if(e[1].name == tableName) {
            found = e[1]
        }
    })
    return found
}

const table1 = tableName => {
    let tables = config.DATABASE_CONFIG.TABLES
    for(const [x, tableValues] of Object.entries(tables)){
        if(tableValues.name.toLowerCase() === tableName.toLowerCase()) return tableValues
    }
}

//populateTableWithDefault("zeus-config")

console.log(table1("zeus-config"))

