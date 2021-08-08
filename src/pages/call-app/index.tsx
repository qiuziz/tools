/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import './index.less';
import { getRedis } from 'utils';
import { useRouterParams } from 'hooks';

/**
 * 唤起APP
 */
export default function CallApp() {
  const openApp = (url: string) => () => {
    if (!url) return;
    top.location.href = url;
  };

  const [urlList, setUrlList] = useState([]);

  const getUrlList = async () => {
    const params = useRouterParams();
    const key = params.key || localStorage.getItem('KEY');
    if (!key) {
      message.info('请先保存URL');
      return;
    }
    const urlTable = await getRedis(key);
    setUrlList(urlTable);
  };

  useEffect(() => {
    getUrlList();
  }, []);

  return (
    <div className="call-app-content">
      <div className="tip">
        <p style={{ fontWeight: 'bold' }}>提示：</p>
        <p>1.点击按钮唤起app打开对于页面</p>
        <p>2.无任何反应或提示网址无效时，请检查协议是否正确，安卓可以更换浏览器尝试</p>
        <p>3.微信内无法打开，请点击右上角···选择在浏览器中打开</p>
      </div>

      <div className="url-list-content">
        {urlList.map((data: any) => {
          const { name = '', url = '' } = data;
          if (!url) return null;
          return (
            <Button type="primary" key={url} className="url-item" onClick={openApp(url)}>
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
