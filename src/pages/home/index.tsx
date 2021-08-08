/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import { getGlobalData } from 'common';
import React from 'react';
import { Link } from 'react-router-dom';
import { PAGE_ROUTE } from 'router/page-route';
import './index.less';

export default function Home() {

  return (
    <div className="home-content">
      <div className="widget-content">
        {PAGE_ROUTE.map((widget: any) => {
          if (widget.invisible) return null;
          return (
            <Link to={(getGlobalData('PREFIX') || '') + widget.url} key={widget.logo} className="widget-wrap">
              <img className="logo" src={widget.logo} alt="" />
              <div className="title">{widget.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
