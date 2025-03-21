import React from 'react';
import {ROUTE_PATH} from './routePath';
import IRoute from '@core/models/base-routes';

const BASE_ROUTES: IRoute[] = [
  {
    title: ROUTE_PATH.dashBoard.title,
    path: ROUTE_PATH.dashBoard.path,
    pathMatch: ROUTE_PATH.dashBoard.pathMatch,
    exact: true,
    Component: React.lazy(() => import('@features/dashboard/pages/dashboard')),
  },
  {
    title: ROUTE_PATH.store.title,
    path: ROUTE_PATH.store.path,
    pathMatch: ROUTE_PATH.store.pathMatch,
    exact: true,
    Component: React.lazy(() => import('@features/store-management/pages/store-management')),
  },
  {
    title: ROUTE_PATH.wholesalers.title,
    path: ROUTE_PATH.wholesalers.path,
    pathMatch: ROUTE_PATH.wholesalers.pathMatch,
    exact: true,
    Component: React.lazy(() => import('@features/wholesalers/pages/wholesalers')),
  },
  {
    title: ROUTE_PATH.invoice.title,
    path: ROUTE_PATH.invoice.path,
    pathMatch: ROUTE_PATH.invoice.pathMatch,
    exact: true,
    Component: React.lazy(() => import('@features/invoice/pages/invoice')),
  }
];

export default BASE_ROUTES;
