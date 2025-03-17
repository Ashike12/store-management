import React from 'react';
import {ROUTE_PATH} from './routePath';
import IRoute from '@core/models/base-routes';

const BASE_ROUTES: IRoute[] = [
  {
    title: ROUTE_PATH.dashBoard.title,
    path: ROUTE_PATH.dashBoard.path,
    exact: true,
    Component: React.lazy(() => import('@features/dashboard/pages/dashboard')),
  },
  {
    title: ROUTE_PATH.store.title,
    path: ROUTE_PATH.store.path,
    exact: true,
    Component: React.lazy(() => import('@features/store-management/pages/store-management')),
  },
  {
    title: ROUTE_PATH.wholesalers.title,
    path: ROUTE_PATH.wholesalers.path,
    exact: true,
    Component: React.lazy(() => import('@features/wholesalers/pages/wholesalers')),
  }
];

export default BASE_ROUTES;
