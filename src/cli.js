#! /usr/bin/env node

import { Command } from 'commander'
import start from './start.js'
import reset from './reset.js'

const progarm = new Command()

progarm
  .command('create')
  .option('--single', 'use single config file for lints', true)
  .option('--eslint', 'use eslint', true)
  .option('--typescript', 'use typescript', true)
  .option('--prettier', 'use prettier', true)
  .option('--commitlint', 'use commitlint', true)
  .option('--stylelint', 'use stylelint', true)
  .action((options) => {
    start(options)
  })

progarm.command('reset').action(() => {
  reset()
})

progarm.parse(process.argv)
