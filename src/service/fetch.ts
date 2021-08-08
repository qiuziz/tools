import Axios, { AxiosRequestConfig } from 'axios';
import { message as antdMsg } from 'antd';
import { isObject } from 'utils';

const successCode = ['200', 200, 0, '0', 'ok', 'true'];


type HttpConfig = AxiosRequestConfig & {
  dataKey: string;
};

// 创建axios实例
const instance = Axios.create({ timeout: 600000, dataKey: 'data' } as HttpConfig);

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器
 * 拦截响应并统一处理
 */
instance.interceptors.response.use(
  (res) => {
    if (res.status && res.status === 200) {
      const { data, config = {}, status } = res;
      console.log(res);
      // 兼容data为string
      if (!isObject(data)) return Promise.resolve(data);
      const { dataKey = 'data' } = config as HttpConfig;
      if (successCode.indexOf(status) > -1 || successCode.indexOf(data.code) > -1) {
        console.log(data[dataKey]);
        return Promise.resolve(data[dataKey] || {});
      }
      antdMsg.error(data.msg || '系统异常');
    }
    return Promise.reject(res);
  },
  (error) => {
    const { response } = error;
    if (response) {
      antdMsg.error(response.statusText || '未知异常');
      return Promise.reject(response);
    } else {
      // 断网情况处理
      if (!window.navigator.onLine) {
        // 通知断网
        antdMsg.error('网络异常');
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default instance;
