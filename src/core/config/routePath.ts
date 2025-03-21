export const ROUTE_PATH = {
  dashBoard: {
    path: '/dashboard',
    pathMatch: 'dashboard',
    title: 'DASHBOARD',
    subTitle: '',
  },
  store: {
    path: '/products',
    pathMatch: 'products',
    title: 'PRODUCTS',
    subTitle: '',
  },
  wholesalers: {
    path: '/wholesalers',
    pathMatch: 'wholesalers',
    title: 'WHOLESALERS',
    subTitle: '',
  },
  invoice: {
    path: '/invoice',
    pathMatch: 'invoice',
    title: 'INVOICE',
    subTitle: '',
  },
  login: {
    path: '/login',
  },
  test: {
    paths: {path: '/test', title: 'test'},
    get one() {
      return {path: `${this.paths.path}/one`, title: 'one'};
    },
  },
};
