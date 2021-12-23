const name = 'add'
const execute = (params = {}) => {

  switch (params.args[1].toLowerCase()) {
    case 'permissions':
      permissions.run()
      break
    case 'bypasses':
      bypasses.run()
      break
    default:
      break
  }
}

export { name, execute }