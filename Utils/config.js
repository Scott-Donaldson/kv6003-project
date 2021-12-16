export default {
  /**
     * Stores the config options (Could have used JSON but not ES6 Import compatible)
     */
  BOTNAME: 'Zeus Bot',
  PREFIX: '>',
  ALLOWED_CHANNELS: ['902198800624521257', '902198909676441680', '915558303189327882'],
  DEV_MODE: true,
  DEV_OPTIONS: {
    REMOVE_DB_ON_START: true
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
          message: 'TEXT'
        },
        default: [
          { id: 1, type: 'INFO', message: 'Database created and populated' }
        ]
      },
      TABLE_MESSAGE_LOGS: {
        name: 'zeus-message-log',
        schema: {
          id: 'INT',
          message: 'TEXT'
        }
      },
      TABLE_CONFIG: {
        name: 'zeus-config',
        schema: {
          name: 'TEXT',
          value: 'TEXT'
        },
        default: [
          { name: 'threashold', value: '0.6' }
        ]
      },
      TABLE_PERMMISSIONS: {
        name: 'zeus-permissions',
        schema: {
          id: 'TEXT',
          value: 'INT'
        },
        default: [
          { id: '148530891679858688', value: 4 }
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
          { statistic: 'messages_checked', value: 0 }
        ]
      }
    }
  }
}
