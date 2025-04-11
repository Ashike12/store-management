export const ROUTE_PATH = {
  dashBoard: {
    path: '/dashboard',
    pathMatch: 'dashboard',
    title: 'DASHBOARD',
    subTitle: '',
    backButtonRoute: null
  },
  store: {
    path: '/products',
    pathMatch: 'products',
    title: 'PRODUCTS',
    subTitle: '',
    backButtonRoute: null
  },
  wholesalers: {
    path: '/wholesalers',
    pathMatch: 'wholesalers',
    title: 'WHOLESALERS',
    subTitle: '',
    backButtonRoute: null
  },
  wholesalerDetails: {
    path: '/wholesaler/invoice/:id',
    pathMatch: 'wholesaler/invoice',
    title: 'WHOLESALERS',
    subTitle: 'INVOICE',
    backButtonRoute: '/wholesalers'
  },
  invoice: {
    path: '/invoice',
    pathMatch: 'invoice',
    title: 'INVOICE',
    subTitle: '',
    backButtonRoute: null
  },
  invoiceDetails: {
    path: '/invoice/details/:id',
    pathMatch: 'invoice/details',
    title: 'INVOICE',
    subTitle: 'DETAILS',
    backButtonRoute: '/invoice'
  },
  invoiceUpdate: {
    path: '/invoice/update/:id',
    pathMatch: 'invoice/update',
    title: 'INVOICE',
    subTitle: 'UPDATE',
    backButtonRoute: '/invoice'
  },
  invoiceAdd: {
    path: '/invoice/add/:id',
    pathMatch: 'invoice/add',
    title: 'INVOICE',
    subTitle: 'ADD',
    backButtonRoute: '/invoice'
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
