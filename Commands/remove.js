import RemoveBypass from './SubCommands/removebypass.js'
// import RemovePermission from "./SubCommands/removepermission.js"

const name = 'remove'
const execute = (params = {}) => {
  const bypass = new RemoveBypass(params)
  // const permission = new RemovePermission(params)

  switch (params.args[1].toLowerCase()) {
    // case 'permissions':
    //   permission.run()
    //   break
    case 'bypasses':
      bypass.run()
      break
    default:
      break
  }
}

export { name, execute }
