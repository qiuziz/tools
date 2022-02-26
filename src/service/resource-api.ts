/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-19 22:21:24
 * @Last Modified by: qiuz
 */

import HttpResource from './fetch';

const API_HOST = '';

const prefix = process.env.NODE_ENV === 'development' ? '' : '';

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

  /**
   * direct fetch
   */
  directFetch: HttpResource(`:type`)
};
