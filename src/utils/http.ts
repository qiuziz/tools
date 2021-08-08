import Axios from 'axios';
import { getCookie } from '../utils/cookie';

const tip = (msg: string) => {
  console.error(msg);
};

const modalQueueMap = new Map();

//接口返回正常,状态异常
const codeErrorHandle = (resData: { message: any; code: number }) => {
  let message = resData.message;
  switch (resData.code) {
    case 1:
      message = message || '操作失败';
      break;
    case 401001:
      message = message || 'token为空';
      break;
    case 401002:
      message = message || 'token未经授权';
      break;
    case 401003:
      message = message || '经纪人没有买商业套餐';
      break;
    case 400001:
      message = message || 'from字段空';
      break;
    case 401004:
      message = message || '对不起，您暂无查看权限。';
      break;
    case 401005:
      message = message || '对不起，您无认领权限，暂时无法操作';
      break;
    case 500:
      message = message || '服务异常';
      break;
    default:
    //token过期
    // case 403:
    //   message = '登录过期, 请重新登录';
    //   break;
    // case 406:
    //   message = '对不起，暂无业主房源';
    //   break;
    //console.log('default:', resData);
  }

  //存在对应状态码
  if (modalQueueMap.has(resData.code)) return;

  //不存在对应状态码
  modalQueueMap.set(resData.code, {
    code: resData.code,
    message: message
  });

  console.log('modalQueueMap:', modalQueueMap);

  if (resData.code == 406) {
    console.warn(message);
    //modalQueueMap.delete(resData.code);
  } else {
    console.error(message);
    modalQueueMap.delete(resData.code);
  }
};

//请求失败后的错误统一处理
const netErrorHandle = (status: any, other: any) => {
  switch (status) {
    //未登录，去登录
    case 401:
      // toLogin();
      break;
    case 403:
      tip('登录过期, 请重新登录');
      // setTimeout(() => {
      //   toLogin();
      // }, 1000);
      break;
    case 404:
      tip('请求不存在!');
      break;
    default:
      console.log(other);
  }
};

//创建axios实例
const instance = Axios.create({ timeout: 5000 });

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */

instance.interceptors.request.use(
  (config) => {
    // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxODg1NzM4MzMzMyJ9.GWnwqses61dKzz5KrOHApOoD0Bc4o1f6KLyGE4soj7U';//获取token
    let token = getCookie('token');
    token && (config.headers.token = token);
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
  (res: any) => {
    if (res.status && res.status == 200) {
      return Promise.resolve(res.data);
    } else {
      codeErrorHandle(res.data);
      return Promise.reject(res);
    }
  },
  (error: any) => {
    const { response } = error;
    if (response) {
      netErrorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      //断网情况处理
      if (!window.navigator.onLine) {
        //通知断网
      } else {
        return Promise.reject(error);
      }
    }
  }
);

export default instance;
