import Classifier from './classifier.js'
import config from './config.js'
import DatabaseManager from './databasemanager.js'
/**
 * @todo
 * create DatabaseManager Class that handles backups and the DatabaseInitializer Class
 */
export default class DatabaseAbstraction {
  constructor () {
    this.dbm = new DatabaseManager()
    this.connection = this.dbm.getConnection()
  }

  getClassifierThreshold () {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name}' WHERE name = ?`
    const res = parseFloat(this.connection.prepare(sql).get('threshold').value) || Classifier.defaultThreashold()
    return res
  }

  setClassifierThreshold (val) {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name
    const sql = `UPDATE '${table}' SET value = ${val} WHERE name = threshold`
    this.connection.prepare(sql).run()
  }

  getStatCount (stat) {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_STATS.name}' WHERE statistic = ?`
    return parseInt(this.connection.prepare(sql).get(stat).value)
  }

  getRowCount (table) {
    const sql = `SELECT COUNT(*) from '${table}'`
    const data = this.connection.prepare(sql).get()
    const res = data[Object.keys(data)[0]]
    return res
  }

  incrementCount (stat) {
    const current = this.getStatCount(stat)
    const sql = `UPDATE '${config.DATABASE_CONFIG.TABLES.TABLE_STATS.name}' SET value = ${current + 1} WHERE statistic = ?`
    this.connection.prepare(sql).run(stat)
  }

  logUserMessage (message, uid, timestampISO) {
    const sql = `INSERT INTO '${config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.name}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.schema, '@')}`
    const statement = this.connection.prepare(sql)
    statement.run({
      id: this.getRowCount(config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.name) + 1,
      uid: uid,
      message: message,
      timestamp: timestampISO
    })
  }

  logSystemMessage (type, message) {
    const sql = `INSERT INTO '${config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.name}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.schema, '@')}`
    const statement = this.connection.prepare(sql)
    const timestamp = new Date()
    statement.run({
      id: this.getRowCount(config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.name) + 1,
      type: type.toUpperCase(),
      message: message,
      timestamp: timestamp.toISOString()
    })
  }

  getUserPermissionLevel (uid) {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_PERMMISSIONS.name}' WHERE uid = ?`
    return parseInt(this.connection.prepare(sql).get(uid).value)
  }

  setUserPermissionLevel (uid, permissionLevel) {
    const sql = `UPDATE '${config.DATABASE_CONFIG.TABLES.TABLE_PERMMISSIONS.name}' SET value = @value WHERE uid = @uid`
    const statement = this.connection.prepare(sql)
    statement.run({
      uid: uid,
      value: permissionLevel
    })
  }

  booleanParse (value) {
    return !!value
  }

  booleanToInt (bool) {
    return (bool) ? 1 : 0
  }

  getConfigOption (configOption) {
    const sql = `SELECT value FROM '${config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name}' WHERE name = ?`
    return parseInt(this.connection.prepare(sql).get(configOption).value)
  }

  setConfigOption (configOption, newValue) {
    const sql = `UPDATE '${config.DATABASE_CONFIG.TABLES.TABLE_CONFIG.name}' SET value = @value WHERE name = @name`
    const statement = this.connection.prepare(sql)
    statement.run({
      name: configOption,
      value: newValue
    })
  }

  toggleConfigOption (configOption) {
    const currentVal = this.getConfigOption(configOption)
    this.setConfigOption(configOption, this.booleanToInt(this.booleanParse(currentVal)))
  }

  getUsersMessagesFromLog (uid) {
    const sql = `SELECT message, timestamp FROM '${config.DATABASE_CONFIG.TABLES.TABLE_MESSAGE_LOGS.name}' WHERE uid = ?`
    return this.connection.prepare(sql).all(uid)
  }

  getSystemLogMessages () {
    const sql = `SELECT message, timestamp, type FROM '${config.DATABASE_CONFIG.TABLES.TABLE_SYSTEM_LOGS.name}'`
    return this.connection.prepare(sql).all()
  }

  getPermissionMap () {
    const sql = `SELECT name, flag FROM '${config.DATABASE_CONFIG.TABLES.TABLE_PERMISSION_MAP.name}'`
    return this.connection.prepare(sql).all()
  }

  isUserInPermissionTable (uid) {
    const sql = `SELECT COUNT(*) FROM '${config.DATABASE_CONFIG.TABLES.TABLE_PERMMISSIONS.name}' WHERE uid = ?`
    const data = this.connection.prepare(sql).get(uid)
    return data[Object.keys(data)[0]] > 0
  }

  addUserToPermissionTable (uid, perm) {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_PERMMISSIONS.name
    const schema = config.DATABASE_CONFIG.TABLES.TABLE_PERMMISSIONS.schema
    const sql = `INSERT INTO '${table}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(schema, '@')}`
    const statement = this.connection.prepare(sql)
    statement.run({
      uid: uid,
      value: perm
    })
  }

  getActions () {
    const sql = `SELECT name, flag FROM '${config.DATABASE_CONFIG.TABLES.TABLE_ACTIONS.name}'`
    return this.connection.prepare(sql).all()
  }

  setActionValue (val) {
    this.setConfigOption('bot_actions', val)
  }

  getActionValue () {
    return this.getConfigOption('bot_actions')
  }

  findBypass (bypass, type) {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_BYPASSES.name
    const sql = `SELECT COUNT(*) FROM ${table} WHERE id = @id AND type = @type`
    const data = this.connection.prepare(sql).get({
      id: bypass,
      type: type
    })
    return data[Object.keys(data)[0]] > 0
  }

  findBypassUser (uid) {
    return this.findBypass(uid, 'USER')
  }

  findBypassRole (roleid) {
    return this.findBypass(roleid, 'ROLE')
  }

  findBypassChannel (channelid) {
    return this.findBypass(channelid, 'CHANNEL')
  }

  addBypass (bypass, type) {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_BYPASSES.name
    const schema = config.DATABASE_CONFIG.TABLES.TABLE_BYPASSES.schema
    const sql = `INSERT INTO '${table}' VALUES ${this.dbm.getDBI().generateFromSchemaWithoutTypeWithCharPrefix(schema, '@')}`
    const statement = this.connection.prepare(sql)
    statement.run({
      id: bypass,
      type: type
    })
  }

  removeBypass (bypass) {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_BYPASSES.name
    const sql = `DELETE FROM '${table}' WHERE id = @id`
    const statement = this.connection.prepare(sql)
    statement.run({
      id: bypass
    })
  }

  getAllBypasses () {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_BYPASSES.name
    const sql = `SELECT id, type FROM '${table}'`
    return this.connection.prepare(sql).all()
  }

  getBypassTypes () {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_BYPASS_TYPES.name
    const sql = `SELECT type FROM '${table}'`
    return this.connection.prepare(sql).all()
  }

  getAllPresences () {
    const table = config.DATABASE_CONFIG.TABLES.TABLE_PRESENCES.name
    const sql = `SELECT name, type FROM '${table}'`
    return this.connection.prepare(sql).all()
  }
}
