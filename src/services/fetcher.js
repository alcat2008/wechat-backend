const axios = require('axios');

const WECHAT_API = 'https://api.weixin.qq.com/';

const fetcher = axios.create({
  baseURL: WECHAT_API,
  withCredentials: true,
});

fetcher.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error(' ------ fetch error: START ------');
    console.error(error);
    console.error(' ------ fetch error: END ------');
    return Promise.reject(error);
  }
);

fetcher.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // console.log(JSON.stringify(body))
      if (response.data && response.data.errcode !== undefined && response.data.errcode !== 0) {
        return Promise.reject(response.data);
      }
      return response.data;
    }
  },
  error => {
    console.error(' ------ fetch error: START ------');
    console.error(error);
    console.error(' ------ fetch error: END ------');
    return Promise.reject(error);
  }
);

module.exports = fetcher;
