// const moment = require('moment')
// const _ = require('lodash')
const { MongoClient } = require('mongodb');
const qs = require('qs');
const { mongodbUrl, appId, appSecret } = require('../config');
const fetcher = require('./fetcher');

/**
 * collection - authority
 * {
 *   app_id - 微信 AppID
 *   access_token - 调用接口的凭证，有效时间为 7200s
 *   expire_time - 过期时间
 * }
 */
const DB_NAME = 'wechat';
const COLLECTION_NAME = 'authority';

// function updateAccessToken(appId, accessToken) {
//   console.log('***  getAccessToken  ***')
//   return new Promise((resolve, reject) => {
//     MongoClient.connect(mongodbUrl, (err, db) => {
//       if (err) {
//         console.error('MongoDB connect error: ', mongodbUrl)
//         reject(err)
//       } else {
//         // 1. 连接到表
//         const collection = db.collection(COLLECTION_NAME)
//
//         // 2. 插入数据
//         collection.updateOne({ app_id: appId }, { $set: { access_token: accessToken }}, (dbErr, result) => {
//           if (dbErr) {
//             console.error('Error update:' + dbErr)
//             reject(dbErr)
//           } else {
//             resolve(result)
//           }
//         })
//
//         // 3. 释放连接
//         db && db.close()
//       }
//     })
//   })
// }

exports.getAccessToken = async function getAccessToken() {
  console.log('***  getAccessToken  ***');
  let client = null;

  try {
    client = await MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true }
    );

    // 1. 连接到表
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

    // 2. 查询数据
    const resultFind = await collection.find({ app_id: appId }).toArray();
    console.log('collection.find: ', resultFind);

    if (resultFind.length > 0 && resultFind[0].expire_time > new Date().getTime()) {
      return resultFind[0].access_token;
    }

    // 集合中还没有数据 或者 集合中数据已过期
    const url = `cgi-bin/token?grant_type=client_credential&${qs.stringify({
      appid: appId,
      secret: appSecret,
    })}`; // eslint-disable-line
    const res = await fetcher.get(url);
    console.log('fetch token : ', res);

    // 3. 插入数据
    await collection.update(
      { app_id: appId },
      {
        $set: {
          access_token: res.access_token,
          expire_time: new Date().getTime() + res.expires_in,
        },
      },
      {
        upsert: true,
      }
    );

    console.log('Success updated!');
    return res.access_token;
  } catch (e) {
    console.error('MongoDB error: ', e);
    return e;
  } finally {
    // 释放连接
    client && client.close();
  }
};
