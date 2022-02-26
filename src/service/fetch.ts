/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2018-11-02 14:38:52
 * @Last Modified by: qiuz
 * @Last Modified time: 2022-02-26 18:00:42
 */

import 'whatwg-fetch';
import { filterObjectEmptyValue } from 'utils';
import { message as antdMsg } from 'antd';

const successCode = [0];
const exitFn = () => {
  // const redirectTo = window.location.href;
  // jump(`/admin/login?redirectTo=${encodeURIComponent(redirectTo)}`, { redirect: true });
};
interface ConfigType {
  loadingDelay?: number;
  des?: boolean;
  [propName: string]: any;
}

const HEADER: any = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

const fetchMethod = (_url: string, _config: any = {}) => {
  return fetch(_url, { ...HEADER, ..._config })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json().then(undefined, () => Promise.resolve(''));
    })
    .then((res: any) => {
      const { config = {}, code, msg } = res;
      const { dataKey = 'data' } = config;
      const { directReturn = false } = _config;
      if (directReturn) {
        return Promise.resolve(res);
      }
      if (code === 401) {
        exitFn();
        return Promise.reject(res);
      }
      if (successCode.indexOf(code) > -1) {
        return Promise.resolve(res[dataKey] || {});
      }
      antdMsg.error(msg || '系统异常');
      return Promise.reject(res);
    })
    .catch((err) => {
      throw err;
    });
};

const matchUrlSearchParams = (url: string, urlSearchParams: any) => {
  if (!urlSearchParams) {
    return url.replace(/\/:[^?]+/g, '');
  }
  const u = new URLSearchParams();
  // tslint:disable-next-line:variable-name
  let _url = Object.keys(urlSearchParams).reduce((pre, next) => {
    if (pre.includes(':' + next)) {
      return pre.replace(':' + next, urlSearchParams[next]);
    } else {
      if (urlSearchParams[next] && urlSearchParams[next].constructor === Array) {
        urlSearchParams[next].forEach((value: any) => {
          u.append(next, value);
        });
      } else {
        u.append(next, urlSearchParams[next]);
      }
      return pre;
    }
  }, url);
  // let u = toQueryString(urlSearchParams);
  _url = _url.replace(/\/:[^?]+/g, '');
  return _url + (u.toString() === '' ? '' : '?' + u);
};

class FetchApi {
  url = '';

  constructor(_url: string) {
    this.url = _url;
  }

  get = (urlSearchParams: object, bodyParams?: object, config?: ConfigType) => {
    return fetchMethod(
      matchUrlSearchParams(this.url, { ...urlSearchParams, ...bodyParams }),
      config
    );
  };

  post = (urlSearchParams?: object, bodyParams?: any, config?: ConfigType) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      ...config,
      method: 'POST',
      body: JSON.stringify(filterObjectEmptyValue(bodyParams))
    });
  };

  upload = (urlSearchParams: object, bodyParams: FormData) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      method: 'POST',
      isUpoad: true,
      body: bodyParams
    });
  };

  delete = (urlSearchParams: object, config?: ConfigType) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      ...config,
      method: 'DELETE'
    });
  };

  put = (urlSearchParams: object, bodyParams: object, config?: ConfigType) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      ...config,
      method: 'PUT',
      body: JSON.stringify(filterObjectEmptyValue(bodyParams))
    });
  };

  patch = (urlSearchParams: object, bodyParams: object, config?: ConfigType) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(filterObjectEmptyValue(bodyParams))
    });
  };
}

const Http = (url: string) => {
  return new FetchApi(url);
};

export default Http;
