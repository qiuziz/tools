/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-19 22:21:24
 * @Last Modified by: qiuz
 */

import Http from './fetch';

const API_HOST = '';

const prefix = process.env.NODE_ENV === 'development' ? '' : '';

export const matchUrlSearchParams = (url: string, urlSearchParams: any) => {
  if (!urlSearchParams) {
    return url.replace(/\/:[^?]+/g, '');
  }
  let u = '';
  let _url = Object.keys(urlSearchParams).reduce((pre, next) => {
    if (pre.indexOf(':' + next) > -1) {
      return pre.replace(':' + next, urlSearchParams[next]);
    } else {
      if (urlSearchParams[next] && urlSearchParams[next].constructor === Array) {
        urlSearchParams[next].forEach((value: any) => {
          u += next + '=' + value + '&';
        });
      } else {
        u += next + '=' + urlSearchParams[next] + '&';
      }
      return pre;
    }
  }, url);
  _url = _url.replace(/\/:[^?]+/g, '');
  return _url + (u.toString() === '' ? '' : '?' + u.substring(0, u.length - 1));
};

const objectValueToString = (data: object) => {
  const result = {};
  Object.keys(data).forEach((key: string) => {
    data[key] !== null && data[key] !== undefined && (result[key] = data[key] + '');
  });
  return result;
};

class HttpRequset {
  url: string;
  constructor(_url: string) {
    this.url = _url;
  }

  get = (urlSearchParams: object = {}, bodyParams: object = {}, config: object = {}) =>
    Http({
      url: matchUrlSearchParams(this.url, {
        ...urlSearchParams
      }),
      data: objectValueToString(bodyParams),
      ...config
    });

  post = (urlSearchParams: object, bodyParams: object, config: object = {}) => {
    console.log('bodyParams', bodyParams);
    return Http({
      url: matchUrlSearchParams(this.url, urlSearchParams),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      data: bodyParams,
      ...config
    });
  };

  upload = (urlSearchParams: object, bodyParams: FormData, config: object = {}) => {
    return Http({
      ...config,
      url: matchUrlSearchParams(this.url, urlSearchParams),
      method: 'POST',
      data: bodyParams,
    });
  };
}

const HttpResource = (url: string) => new HttpRequset(url);

export const Resource = {
  /**
   * 上传
   */
  cdn: HttpResource(`${API_HOST}${prefix}/upload/:type`),
  url: HttpResource(`${API_HOST}${prefix}/url/:type`),
  /**
   * redis
   */
  redis: HttpResource(`${API_HOST}${prefix}/redis/:type`),

  /**
   * doc
   */
  doc: HttpResource(`${API_HOST}${prefix}/:type`),
};
