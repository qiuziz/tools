import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Dashboard from 'pages/dashboard';
import { setGlobalData } from 'common';
import { message } from 'antd';
import reportWebVitals from 'reportWebVitals';

declare const window: any;
declare let __webpack_public_path__: any;

setGlobalData('PREFIX', '');

/**
 * @see https://qiankun.umijs.org/zh/faq#a-%E4%BD%BF%E7%94%A8-webpack-%E8%BF%90%E8%A1%8C%E6%97%B6-publicpath-%E9%85%8D%E7%BD%AE
 * runtime publicPath 主要解决的是微应用动态载入的 脚本、样式、图片 等地址不正确的问题。
 */
if (window.__POWERED_BY_QIANKUN__) {
  setGlobalData('PREFIX', '/q/widgets');
  // eslint-disable-next-line no-unused-vars
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

function render(props: any) {
  const { container } = props;
  message.config({
    getContainer: () => (container || document).querySelector('#widget-root')
  });
  ReactDOM.render(<Dashboard />, (container || document).querySelector('#widget-root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {}

export async function mount(props: any) {
  render(props);
}

export async function unmount(props: any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode((container || document).querySelector('#widget-root'));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
