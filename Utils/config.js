import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  /**
     * Stores the config options (Could have used JSON but not ES6 Import compatible)
     */
  BOTNAME: 'Zeus Bot',
  VERSION: process.env.npm_package_version || pkg.version,
  PREFIX: '>',
  ALLOWED_CHANNELS: ['902198800624521257', '902198909676441680', '915558303189327882', "742107666939379812"],
  DEV_MODE: true,
  DEV_OPTIONS: {
    REMOVE_DB_ON_START: true,
    IGNORE_PERMISSIONS: false
  },
  DATABASE_CONFIG: {
    DATABASE_FOLDER: './Utils/db/',
    BACKUP_FOLDER: './db-backups/',
    DATABASE_NAME: 'db-zeus.db',
    TABLES: {
      TABLE_SYSTEM_LOGS: {
        name: 'zeus-system-log',
        schema: {
          id: 'INT',
          type: 'TEXT',
          message: 'TEXT',
          timestamp: 'TEXT'
        }
      },
      TABLE_MESSAGE_LOGS: {
        name: 'zeus-message-log',
        schema: {
          id: 'INT',
          uid: 'TEXT',
          message: 'TEXT',
          timestamp: 'TEXT'
        }
      },
      TABLE_CONFIG: {
        name: 'zeus-config',
        schema: {
          name: 'TEXT',
          value: 'INT'
        },
        default: [
          { name: 'threshold', value: 6 },
          { name: 'bot_actions', value: 1 }
        ]
      },
      TABLE_PERMMISSIONS: {
        name: 'zeus-permissions',
        schema: {
          uid: 'TEXT',
          value: 'INT'
        },
        default: [
          { uid: '148530891679858688', value: 1 }
        ]
      },
      TABLE_BYPASSES: {
        name: 'zeus-bypasses',
        schema: {
          id: 'TEXT',
          type: 'TEXT'
        }
      },
      TABLE_STATS: {
        name: 'zeus-stats',
        schema: {
          statistic: 'TEXT',
          value: 'INT'
        },
        default: [
          { statistic: 'messages_flagged', value: 0 },
          { statistic: 'messages_checked', value: 0 },
          { statistic: 'messages_command', value: 0 }
        ]
      },
      TABLE_ACTIONS: {
        name: 'zeus-actions',
        schema: {
          id: 'INT',
          flag: 'INT',
          name: 'TEXT'
        },
        default: [
          { id: 0, flag: 0x1, name: 'ALERT' },
          { id: 1, flag: 0x2, name: 'WARN' },
          { id: 2, flag: 0x4, name: 'REMOVE' }
        ]
      },
      TABLE_PERMISSION_MAP: {
        name: 'zeus-permission-map',
        schema: {
          name: 'TEXT',
          flag: 'INT'
        },
        default: [
          { name: 'ADMINISTRATOR', flag: 0x1 },
          { name: 'CAN_VIEW_SYS_LOG', flag: 0x2 },
          { name: 'CAN_VIEW_USR_LOG', flag: 0x4 },
          { name: 'CAN_CHANGE_CONF', flag: 0x8 },
          { name: 'CAN_ADD_BYPASS', flag: 0x10 },
          { name: 'CAN_ADD_PERMS', flag: 0x20 }
        ]
      },
      TABLE_PRESENCES: {
        name: 'zeus-presences',
        schema: {
          name: 'TEXT',
          type: 'TEXT'
        },
        default: [
          { name: 'your messages', type: 'WATCHING' },
          { name: 'a nice game of cards', type: 'PLAYING' },
          { name: 'to some chill music', type: 'LISTENING' }
        ]
      },
      TABLE_BYPASS_TYPES: {
        name: 'zeus-bypass-types',
        schema: {
          type: 'TEXT'
        },
        default: [
          { type: 'CHANNEL' },
          { type: 'USER' },
          { type: 'ROLE' }
        ]
      }
    }
  },
  CHANNELS: {
    LOG_CHANNEL: '915558303189327882'
  },
  ROLES: {
    ALERT_ROLE: '757950405287084092'
  }
}
