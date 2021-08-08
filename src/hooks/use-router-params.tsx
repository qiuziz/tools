/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-30 12:07:49
 * @Last Modified by: qiuz
 */

import qs from 'qs';

export const useRouterParams = (): Record<string, any> => {
  const sParams = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const hParams = qs.parse(window.location.hash.replace(/(.*)\?/, ''), { ignoreQueryPrefix: true });
  return { ...sParams, ...hParams };
};
