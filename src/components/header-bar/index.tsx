/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:40:37
 * @Last Modified by: qiuz
 */

import React, { isValidElement } from 'react';
import { Dropdown, Menu } from 'antd';
import { useViewport } from 'hooks';
import { PAGE_ROUTE } from 'router/page-route';
import './index.less';
import { MenuOutlined } from '@ant-design/icons';
import { RIGHT_BTN } from './constant';

const HeaderRight = RIGHT_BTN.map((btn: any) => {
  return (
    <a key={btn.key} className="btn-a" target={btn.target} href={btn.url}>
      {btn.title}
    </a>
  );
});

const HeaderBar = () => {
  const { width } = useViewport();

  return (
    <div className="header-bar">
      {width <= 600 ? (
        <Dropdown
          overlay={() => (
            <Menu>
              {[...PAGE_ROUTE, ...HeaderRight].map((menu: any, index: number) => {
                if (isValidElement(menu)) {
                  return <Menu.Item key={index}>{menu}</Menu.Item>;
                }
                if (menu.invisible) return null;
                return (
                  <Menu.Item key={menu.key}>
                    <a href={menu.url}>{menu.title}</a>
                  </Menu.Item>
                );
              })}
            </Menu>
          )}
          placement="bottomRight"
        >
          <MenuOutlined className="menu-icon" />
        </Dropdown>
      ) : (
        <>
          <ul className="header-ul">
            {PAGE_ROUTE.map((menu: any) => {
              if (menu.invisible) return null;
              return (
                <li key={menu.key}>
                  <a className="btn-a" href={menu.url}>
                    {menu.title}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="right-btn">{HeaderRight}</div>
        </>
      )}
    </div>
  );
};

export default HeaderBar;
