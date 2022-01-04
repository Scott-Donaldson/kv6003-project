import SetThreshold from './SubCommands/setthreshold.js'

const name = 'set'
const execute = (params = {}) => {
  const threashold = new SetThreshold(params)

  switch (params.args[1].toLowerCase()) {
    case 'threshold':
      threshold.run()
      break
    default:
      break
  }
}

export { name, execute }
