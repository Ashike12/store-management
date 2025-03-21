import {ComponentType, LazyExoticComponent} from 'react';

export default interface IRoute {
  title: string;
  path: string;
  pathMatch: string;
  exact: boolean;
  Component: LazyExoticComponent<ComponentType<unknown>>;
}
