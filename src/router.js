// const qs = require('qs');
const Router = require('koa-router');
const mapper = require('./mapper');
const { getAccessToken } = require('./services/authority');

const router = new Router();

router.all('/token', async (ctx, next) => {
  const accessToken = await getAccessToken();
  ctx.body = {
    code: 0,
    errmsg: '接口响应描述',
    data: accessToken,
  };
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
