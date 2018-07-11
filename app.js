const path = require('path');
const chalk = require('chalk');

const Koa = require('koa');
const body = require('koa-body');
const views = require('koa-views');
const logger = require('koa-logger');
const cors = require('@koa/cors');
// const error = require('koa-error')
const router = require('./src/router');
const { port } = require('./src/config');

const app = new Koa();

app
  .use(
    body({
      // multipart: true,
      // formidable: {
      //   maxFileSize: 200*1024*1024	// 设置上传文件大小最大限制，默认2M
      // }
    })
  )
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

// x-response-time
// app.use(async (ctx, next) => {
//   const start = Date.now()
//   await next()
//   const ms = Date.now() - start
//   ctx.set('X-Response-Time', `${ms}ms`)
// })

// 加载模板引擎
app.use(
  views(path.join(__dirname, './src/views'), {
    extension: 'ejs',
  })
);

// response
app.use(async ctx => {
  // ctx.body = 'Hello World';
  const title = 'Wechat backend';
  await ctx.render('index', { title });
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
