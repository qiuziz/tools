/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-23 22:57:35
 * @Last Modified by: qiuz
 */

import { isObject } from './is-type';

/**
 * JSON字符串格式化，若解析失败返回原数据
 * @param str
 * @returns JSON String | str
 */
export const handleJsonStr = (str: string) => {
  if (!str) return str;
  let json = null;
  try {
    json = JSON.parse(str.replace(/(?:\s*['"]*)?([a-zA-Z0-9_-]+)(?:['"]*\s*)?:/g, '"$1":'));
  } catch (error) {
    console.log(error);
  }
  return json ? JSON.stringify(json, null, 4) : str;
};

export const isJson = (str: string) => {
  try {
    return isObject(JSON.parse(str));
  } catch (e) {
    return false;
  }
};

const IS_SETUPED_SCRIPT: string[] = [];
export const setupScript = (src: string, crossorigin = ''): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (IS_SETUPED_SCRIPT.indexOf(src) > -1) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.crossOrigin = crossorigin;
    script.onerror = (err: any) => {
      console.log(err);
      document.body.removeChild(script);
      reject(new URIError(`The Script ${src} is no accessible.`));
    };
    script.onload = () => {
      IS_SETUPED_SCRIPT.push(src);
      resolve();
    };
    document.body.appendChild(script);
  });
};
