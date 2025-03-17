import React from 'react';
import {ROUTE_PATH} from './routePath';
import IRoute from '@core/interfaces/base-routes';

const BASE_ROUTES: IRoute[] = [
  {
    title: ROUTE_PATH.dashBoard.title,
    path: ROUTE_PATH.dashBoard.path,
    exact: true,
    Component: React.lazy(() => import('@features/dashboard/pages/dashboard')),
  },
  {
    title: ROUTE_PATH.task.title,
    path: ROUTE_PATH.task.path,
    exact: true,
    Component: React.lazy(() => import('@features/task/pages/task')),
  }
];

export default BASE_ROUTES;
