/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React, { useState } from 'react';
import { LIST } from './constant';
import './index.less';

export default function SiteMap() {
  const [site, setSite] = useState('');

  const go = (url: string) => () => {
    setSite(url);
    window.open(url, '_blank');
  };

  return (
    <div className="site-map">
      {LIST.map((site: any) => {
        return (
          <div className="site-map-list-btn" key={site.url} onClick={go(site.url)}>
            <p className="title">{site.title}</p>
            <a href={site.url} target="_blank">
              {site.url}
            </a>
          </div>
        );
      })}

      <a
        className="edit-btn"
        target="_blank"
        href="https://github.com/qiuziz/tools/edit/master/src/pages/site-map/constant.ts"
      >
        <img src="https://gitee.com/qiuz/img/raw/master/20220227001321.png" alt="新增" />
        新增
      </a>

      {/* <iframe id="site-frame" src={site} onLoad={onIframeError} /> */}
    </div>
  );
}
