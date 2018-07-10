#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage('<command> [options]')
  .option('-p, --port [port]', 'set server port [3003]', '3003')
  .option(
    '--mongodb [mongodb]',
    'set host for redis [mongodb://127.0.0.1:27017/]',
    'mongodb://127.0.0.1:27017/'
  )
  .option('-ai, --appid [appid]', 'set appid')
  .option('-as, --appsecret [appsecret]', 'set appsecret')
  .parse(process.argv);

process.on('SIGINT', () => {
  program.runningCommand && program.runningCommand.kill('SIGKILL'); // eslint-disable-line
  process.exit(0);
});

module.exports = {
  port: program.port,
  mongodbUrl: program.mongodb,
  appId: program.appid,
  appSecret: program.appsecret,
};
