import AddBypass from './SubCommands/addbypass.js'
// import AddPermission from "./SubCommands/addpermission.js"

const name = 'add'
const execute = (params = {}) => {
  // const permission = new AddPermission(params)
  const bypass = new AddBypass(params)

  switch (params.args[1].toLowerCase()) {
    case 'bypass':
      bypass.run()
      break
    default:
      break
  }
}

export { name, execute }
