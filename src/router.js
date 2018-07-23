// const qs = require('qs');
const path = require('path');
const Router = require('koa-router');
const mapper = require('./mapper');
const { getAccessToken } = require('./services/authority');
const { uploadFile } = require('./services/upload');
const { getActivities, addActivity } = require('./services/family');

const router = new Router();

router.all('/activity', async (ctx, next) => {
  await ctx.render('activity');
});

router.post('/api/family/activities', async (ctx, next) => {
  const { currentPage, pageSize } = ctx.request.body;
  const activities = await getActivities(currentPage, pageSize);
  ctx.body = {
    code: 0,
    errmsg: '成功',
    data: activities,
  };
});

router.post('/api/family/activities/add', async (ctx, next) => {
  const submiteData = ctx.request.body;
  const retValue = await addActivity(submiteData);
  ctx.body = {
    code: 0,
    errmsg: '成功',
    data: retValue,
  };
});

router.all('/token', async (ctx, next) => {
  const accessToken = await getAccessToken();
  ctx.body = {
    code: 0,
    errmsg: '成功',
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
