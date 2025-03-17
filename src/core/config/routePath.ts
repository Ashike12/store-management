export const ROUTE_PATH = {
  dashBoard: {
    path: '/dashboard',
    pathMatch: 'dashboard',
    title: 'DASHBOARD',
    subTitle: '',
  },
  task: {
    path: '/task',
    pathMatch: 'task',
    title: 'TASK',
    subTitle: '',
  },
  customerOverview: {
    path: '/customer/overview/:id',
    pathMatch: 'customer/overview',
    title: 'OVERVIEW',
    subTitle: 'CUSTOMER',
  },
  customerSumary: {
    path: '/customer/summary/:id',
    pathMatch: 'customer/summary',
    title: 'SUMMARY',
    subTitle: 'CUSTOMER',
  },
  customerInsuranceCard: {
    path: '/customer/insurance-card/:id',
    pathMatch: 'customer/insurance-card',
    title: 'INSURANCE_CARD',
    subtitle: 'CUSTOMER',
  },
  customerCostSharing: {
    path: '/customer/cost-sharing/:id',
    pathMatch: 'customer/cost-sharing',
    title: 'COST_SHARING',
    subtitle: 'CUSTOMER',
  },
  customerRelationship: {
    path: '/customer/relationship/:id',
    pathMatch: 'customer/relationship',
    title: 'RELATIONSHIP',
    subtitle: 'CUSTOMER',
  },
  servicesOverview: {
    path: '/customer/services-overview/:id',
    pathMatch: 'customer/services-overview',
    title: 'OVERVIEW',
    subtitle: 'SERVICES',
  },
  servicesInvoices: {
    path: '/customer/services-invoices/:id',
    pathMatch: 'customer/services-invoices',
    title: 'INVOICES',
    subtitle: 'SERVICES',
  },
  servicesDailyAllowance: {
    path: '/customer/services-daily-allowance/:id',
    pathMatch: 'customer/services-daily-allowance',
    title: 'DAILY_ALLOWANCE',
    subtitle: 'SERVICES',
  },
  servicesCapitalBenefits: {
    path: '/customer/services-capital-benefits/:id',
    pathMatch: 'customer/services-capital-benefits',
    title: 'CAPITAL_BENEFITS',
    subtitle: 'SERVICES',
  },
  servicesReclaims: {
    path: '/customer/services-reclaims/:id',
    pathMatch: 'customer/services-reclaims',
    title: 'RECLAIMS',
    subtitle: 'SERVICES',
  },
  servicesCases: {
    path: '/customer/services-cases/:id',
    pathMatch: 'customer/services-cases',
    title: 'CASES',
    subtitle: 'SERVICES',
  },
  servicesCostSharing: {
    path: '/customer/services-cost-sharing/:id',
    pathMatch: 'customer/services-cost-sharing',
    title: 'COST_SHARING',
    subtitle: 'SERVICES',
  },
  servicesAssignmentOfClaims: {
    path: '/customer/services-assignment-of-claims/:id',
    pathMatch: 'customer/services-assignment-of-claims',
    title: 'ASSIGNMENT_OF_CLAIMS',
    subtitle: 'SERVICES',
  },
  servicesTransfer: {
    path: '/customer/services-transfer/:id',
    pathMatch: 'customer/services-transfer',
    title: 'TRANSFER',
    subtitle: 'SERVICES',
  },
  servicesDisability: {
    path: '/customer/services-disability/:id',
    pathMatch: 'customer/services-disability',
    title: 'DISABILITY',
    subtitle: 'SERVICES',
  },
  financesDemand: {
    path: '/customer/finances-demand/:id',
    pathMatch: 'customer/finances-demand',
    title: 'DEMAND',
    subtitle: 'FINANCES',
  },
  financesPayment: {
    path: '/customer/finances-payment/:id',
    pathMatch: 'customer/finances-payment',
    title: 'PAYMENT',
    subtitle: 'FINANCES',
  },
  documents: {
    path: '/customer/documents/:id',
    pathMatch: 'customer/documents',
    title: 'DOCUMENTS',
    subtitle: '',
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
