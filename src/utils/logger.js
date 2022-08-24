import chalk from 'chalk'

const logger = {
  info: (msg) => {
    console.log(chalk.blue(msg))
  },
  warn: (msg) => {
    console.log(chalk.yellow(`[Warning]: ${msg}`))
  },
  error: (msg) => {
    console.log(chalk.red(`[error]: ${msg}`))
  }
}

export default logger
