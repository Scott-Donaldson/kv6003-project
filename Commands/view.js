import ViewLogs from './SubCommands/viewlogs.js'
import ViewPermissions from './SubCommands/viewpermissions.js'

const name = 'view'
const execute = (params = {}) => {
  const logs = new ViewLogs(params)
  const permissions = new ViewPermissions(params)

  switch (params.args[1].toLowerCase()) {
    case 'logs':
      logs.run()
      break
    case 'permissions':
      permissions.run()
      break
    case 'bypasses':
      break
    case 'stats':
      break
  }
}

export { name, execute }
