// const path = require('path');
const chalk = require('chalk');

const Koa = require('koa');
const logger = require('koa-logger');
const cors = require('@koa/cors');
// const error = require('koa-error')
const router = require('./src/router');
const { port } = require('./src/config');

const app = new Koa();

app.use(logger()).use(cors())
.use(router.routes())
.use(router.allowedMethods());

// x-response-time
// app.use(async (ctx, next) => {
//   const start = Date.now()
//   await next()
//   const ms = Date.now() - start
//   ctx.set('X-Response-Time', `${ms}ms`)
// })

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});

// 404 page
// app.use(async ctx => {
//   // we need to explicitly set 404 here
//   // so that koa doesn't assign 200 on body=
//   ctx.status = 404
//
//   switch (ctx.accepts('html', 'json')) {
//     case 'html':
//       ctx.type = 'html'
//       ctx.body = '<p>Page Not Found</p>'
//       break
//     case 'json':
//       ctx.body = {
//         message: 'Page Not Found'
//       }
//       break
//     default:
//       ctx.type = 'text'
//       ctx.body = 'Page Not Found'
//   }
// })

// app.use(error({
//   engine: 'pug',
//   template: path.join(__dirname, '/views/error.pug')
// }))

app.listen(port);

console.log();
console.log(chalk.blue('Wechat backend is running on port [', port, ']'));
console.log(chalk.blue('For further info, please visit http://127.0.0.1:' + port + '/'));
console.log();
