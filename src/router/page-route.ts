/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-03 16:44:47
 * @Last Modified by: qiuz
 */

import { lazy } from 'react';

export const PAGE_ROUTE = [
  {
    id: 1,
    key: 1,
    title: 'URL编码',
    logo: 'https://gitee.com/qiuz/img/raw/master/20220225225717.png',
    component: lazy(() => import('pages/qrcode')),
    url: '/tools/qrcode'
  },
  {
    id: 2,
    key: 2,
    invisible: true,
    title: 'CDN上传',
    logo: 'https://gitee.com/qiuz/img/raw/master/20220225230043.png',
    component: lazy(() => import('pages/cdn-upload')),
    url: '/cdn-img-upload/'
  },
  {
    id: 4,
    key: 4,
    // 不显示入口
    invisible: true,
    title: '唤起APP',
    component: lazy(() => import('pages/call-app')),
    url: '/call-app/'
  },
  {
    id: 5,
    key: 5,
    // 不显示入口
    invisible: true,
    title: '文档',
    component: lazy(() => import('pages/document')),
    url: '/document/'
  },
  {
    id: 6,
    key: 6,
    title: '工具集',
    logo: 'https://gitee.com/qiuz/img/raw/master/tool.png',
    component: lazy(() => import('pages/site-map')),
    url: '/tools/site-map'
  },
];
