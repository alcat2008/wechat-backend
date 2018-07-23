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
const DB_NAME = 'family';
const COLLECTION_NAME = 'activities';

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

exports.addActivity = async function addActivity(activity) {
  console.log('***  addActivity  ***');
  let client = null;

  try {
    client = await MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true }
    );

    // 1. 连接到表
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

    // 2. 插入数据
    const resultInsert = await collection.insert(activity);
    console.log('collection.insert: ', resultInsert);
  } catch (e) {
    console.error('MongoDB error: ', e);
    return e;
  } finally {
    // 释放连接
    client && client.close();
  }
};

exports.getActivities = async function getActivities(currentPage, pageSize) {
  console.log('***  getActivities  ***');
  let client = null;

  try {
    client = await MongoClient.connect(
      mongodbUrl,
      { useNewUrlParser: true }
    );

    // 1. 连接到表
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

    // "data": [
    //   {
    //     name: "巴布洛亲子庄园",
    //     thumbnail: "https://pics.lvjs.com.cn/pics/super/2017/05/1495678170_74033.jpg",
    //     url: "https://m.lvmama.com/hotel/hotelDetail/?productId=991440",
    //     brief: "酒店位于巴布洛生态谷内，凡在驴妈妈订购房间即送巴布洛入园门票（人）2张、含园内观光车票），车辆入园券1张，超市米、油类商品5元优惠券2张。"
    //   },
    //   {
    //     name: "巴布洛亲子庄园",
    //     thumbnail: "https://pics.lvjs.com.cn/pics/super/2017/05/1495678170_74033.jpg",
    //     url: "https://m.lvmama.com/hotel/hotelDetail/?productId=991440",
    //     brief: "酒店位于巴布洛生态谷内，凡在驴妈妈订购房间即送巴布洛入园门票（人）2张、含园内观光车票），车辆入园券1张，超市米、油类商品5元优惠券2张。"
    //   },
    //   {
    //     name: "巴布洛亲子庄园",
    //     thumbnail: "https://pics.lvjs.com.cn/pics/super/2017/05/1495678170_74033.jpg",
    //     url: "https://m.lvmama.com/hotel/hotelDetail/?productId=991440",
    //     brief: "酒店位于巴布洛生态谷内，凡在驴妈妈订购房间即送巴布洛入园门票（人）2张、含园内观光车票），车辆入园券1张，超市米、油类商品5元优惠券2张。"
    //   }
    // ],
    // "page": {
    //   "currentPage": currentPage,
    //   "pageSize": pageSize,
    //   "totalPage": 3,
    //   "totalCount": 20,
    //   "rows": null
    // },
    // 2. 查询数据
    // TODO. 注意，此处性能较差，待优化
    const totalCount = await collection.find().count();
    const resultFind = await collection
      .find()
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .toArray();
    console.log('collection.find: ', resultFind);

    return {
      data: resultFind,
      page: {
        currentPage,
        pageSize,
        totalPage: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    };
  } catch (e) {
    console.error('MongoDB error: ', e);
    return e;
  } finally {
    // 释放连接
    client && client.close();
  }
};
