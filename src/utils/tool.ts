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

export const filterObjectEmptyValue = (data: object | undefined) => {
  if (!data) return {};
  const result = {};
  Object.keys(data).forEach((key: string) => {
    data[key] !== null && data[key] !== undefined && (result[key] = data[key]);
  });
  return result;
};

/**
 * @description 数组切割分组
 * @param array
 * @param subGroupLength
 */
 export const arrayGroup = (array: any[], subGroupLength: number, fillItem?: any): any[] => {
  const reslut = [];
  for (let i = 0, len = array.length; i < len; i += subGroupLength) {
    const group = array.slice(i, i + subGroupLength);
    if (fillItem && group.length < subGroupLength) {
      group.push(...new Array(subGroupLength - group.length).fill(fillItem));
    }
    reslut.push(group);
  }
  return reslut;
};
