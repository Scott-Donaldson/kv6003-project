import SetThreashold from './SubCommands/setthreashold.js'

const name = 'set'
const execute = (params = {}) => {
  const threashold = new SetThreashold(params)

  switch (params.args[1].toLowerCase()) {
    case 'threshold':
      threashold.run()
      break
    default:
      break
  }
}

export { name, execute }
