const request = require('request');

const WECHAT_API = 'https://api.weixin.qq.com/';

module.exports = function fetch(url) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: WECHAT_API + url,
      json: true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // console.log(JSON.stringify(body))
        if (body.errcode !== undefined && body.errcode !== 0) {
          reject(body)
        } else {
          resolve(body)
        }
      } else {
        console.log(JSON.stringify(error))
        reject(error)
      }
    })
  })
}
