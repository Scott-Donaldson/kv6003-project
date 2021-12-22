import ViewActions from './SubCommands/viewactions.js'
import ViewBypasses from './SubCommands/viewbypasses.js'
import ViewLogs from './SubCommands/viewlogs.js'
import ViewPermissions from './SubCommands/viewpermissions.js'
import ViewStats from './SubCommands/viewstats.js'

const name = 'view'
const execute = (params = {}) => {
  const logs = new ViewLogs(params)
  const permissions = new ViewPermissions(params)
  const actions = new ViewActions(params)
  const stats = new ViewStats(params)
  const bypasses = new ViewBypasses(params)

  switch (params.args[1].toLowerCase()) {
    case 'logs':
      logs.run()
      break
    case 'permissions':
      permissions.run()
      break
    case 'bypasses':
      bypasses.run()
      break
    case 'stats':
      stats.run()
      break
    case 'actions':
      actions.run()
      break
    default:
      break
  }
}

export { name, execute }
