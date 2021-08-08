/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-06-08 00:01:12
 * @Last Modified by: qiuz
 */

import { Resource } from 'service';
import { isArray, isObject, isString } from './is-type';

export const getRedis = async (key: string): Promise<any> => {
  if (!key) {
    console.error('key should be not null');
    return Promise.reject();
  }
  try {
    const res: any = await Resource.redis.get({ type: 'get', key }, {});
    return isString(res) ? JSON.parse(res) : res;
  } catch (error) {
    return console.log(error);
  }
};

export const setRedis = async (key: string, value: any): Promise<any> => {
  if (!key) {
    console.error('key should be not null');
    return Promise.reject();
  }
  if (!value) {
    console.error('val should be not null');
    return Promise.reject();
  }
  const val = isObject(value) || isArray(value) ? JSON.stringify(value) : value.toString();
  try {
    return Resource.redis.post({ type: 'set' }, { data: { key, val } });
  } catch (error) {
    return console.log(error);
  }
};

export const delRedis = async (key: string): Promise<any> => {
  if (!key) {
    console.error('key should be not null');
    return Promise.reject();
  }
  try {
    return Resource.redis.get({ type: 'get', key });
  } catch (error) {
    return console.log(error);
  }
};

export const existRedis = async (key: string): Promise<any> => {
  if (!key) {
    console.error('key should be not null');
    return Promise.reject();
  }
  try {
    return Resource.redis.get({ type: 'exists', key });
  } catch (error) {
    return console.log(error);
  }
};
