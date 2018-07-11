// const qs = require('qs');
const path = require('path');
const Router = require('koa-router');
const mapper = require('./mapper');
const { getAccessToken } = require('./services/authority');
const { uploadFile } = require('./services/upload');

const router = new Router();

router.all('/token', async (ctx, next) => {
  const accessToken = await getAccessToken();
  ctx.body = {
    code: 0,
    errmsg: '接口响应描述',
    data: accessToken,
  };
});

router.post('/upload', async (ctx, next) => {
  // 上传文件请求处理
  let result = { success: false };
  let serverFilePath = path.join(__dirname, '../upload-files');

  // 上传文件事件
  result = await uploadFile(ctx, {
    fileType: 'album', // common or album
    path: serverFilePath,
  });

  ctx.body = result;
});

// Object.keys(mapper).forEach(m => {
//   router.all(m, (ctx, next) => {
//     const mItem = mapper(m)
//     const url = `${WECHAT_API}${mItem.url || m}&${qs.stringify({ appid: appId, secret: appSecret })}`
//
//
//   });
// });

module.exports = router;
