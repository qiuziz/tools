/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import './index.less';
import { HeaderBar } from 'components';
import { ViewportProvider } from 'hooks';
import BasicRoute from 'router';
import { getGlobalData } from 'common';

const { Header, Content, Footer } = Layout;

Spin.setDefaultIndicator(
  <div className="loading__box">
    <div className="loading__box-lds">
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <ViewportProvider>
      <BrowserRouter>
        <Layout className="tools-layout">
          {!getGlobalData('PREFIX') && (
            <Header className="tools-layout-header">
              <div className="tools-layout-logo">
                <a href="/">tools</a>
              </div>
              <HeaderBar />
            </Header>
          )}
          <Content
            style={{
              marginTop: !getGlobalData('PREFIX') ? '64px' : 0
            }}
            className="tools-layout-content"
          >
            <BasicRoute />
          </Content>
          {!getGlobalData('PREFIX') && (
            <Footer className="tools-layout-footer">tools ©2021 Created by qiuz</Footer>
          )}
        </Layout>
      </BrowserRouter>
    </ViewportProvider>
  );
}
