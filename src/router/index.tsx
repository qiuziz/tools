/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:37:50
 * @Last Modified by: qiuz
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from 'pages/home';
import { PAGE_ROUTE } from './page-route';
import { getGlobalData } from 'common';

const BasicRoute = () => (
  <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {PAGE_ROUTE.map((comp: any) => {
          return <Route key={comp.url} path={(getGlobalData('PREFIX') || '') + comp.url} component={comp.component} />;
        })}
        <Route path="/" component={Home} />
        <Route exact render={() => <Redirect to="/" />} />
      </Switch>
  </Suspense>
);

export default BasicRoute;
