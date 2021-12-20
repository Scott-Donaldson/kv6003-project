import ViewActions from './SubCommands/viewactions.js'
import ViewLogs from './SubCommands/viewlogs.js'
import ViewPermissions from './SubCommands/viewpermissions.js'

const name = 'view'
const execute = (params = {}) => {
  const logs = new ViewLogs(params)
  const permissions = new ViewPermissions(params)
  const actions = new ViewActions(params)

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
    case 'actions':
      actions.run()
      break
    default:
      break
  }
}

export { name, execute }
