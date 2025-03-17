import IconFileText from '@assets/icons/IconFileText';
import IconHandshake from '@assets/icons/IconHandshake';
import IconHandshakeFilled from '@assets/icons/IconHandshakeFilled';
import IconMoney from '@assets/icons/IconMoney';
import IconMoneyFilled from '@assets/icons/IconMoneyFilled';
import IconReadCvlogo from '@assets/icons/IconReadCvlogo';
import IconReadCvLogoFilled from '@assets/icons/IconReadCvLogoFilled';
import IconFileTextFilled from '@assets/icons/IconFileTextFilled';
import {
  PartnerCardItem,
  PartnerSubItem,
  ServicesSubItem,
  FinancesSubItem,
} from '@core/enums/partner-card-item.enum';
import {ROUTE_PATH} from '@core/config/routePath';

export const pinnedPartnerMenuItems = [
  {
    type: PartnerCardItem.PARTNER,
    text: 'PARTNER',
    icon: IconHandshake,
    filledIcon: IconHandshakeFilled,
    subItems: [
      {
        type: PartnerSubItem.OVERVIEW,
        text: 'OVERVIEW',
        path: ROUTE_PATH.customerOverview.pathMatch + '/',
      },
      {
        type: PartnerSubItem.PREMIUM_SUBSIDY,
        text: 'PREMIUM_SUBSIDY',
        path: ROUTE_PATH.customerSumary.pathMatch + '/',
      },
      {
        type: PartnerSubItem.INSURANCE_CARD,
        text: 'INSURANCE_CARD',
        path: ROUTE_PATH.customerInsuranceCard.pathMatch + '/',
      },
      {
        type: PartnerSubItem.COST_SHARING,
        text: 'COST_SHARING',
        path: ROUTE_PATH.customerCostSharing.pathMatch + '/',
      },
      {
        type: PartnerSubItem.RELATIONSHIP,
        text: 'RELATIONSHIP',
        path: ROUTE_PATH.customerRelationship.pathMatch + '/',
      },
    ],
  },
  {
    type: PartnerCardItem.SERVICES,
    text: 'SERVICES',
    icon: IconReadCvlogo,
    filledIcon: IconReadCvLogoFilled,
    subItems: [
      {
        type: ServicesSubItem.OVERVIEW,
        text: 'OVERVIEW',
        path: ROUTE_PATH.servicesOverview.pathMatch + '/',
      },
      {
        type: ServicesSubItem.INVOICES,
        text: 'INVOICES',
        path: ROUTE_PATH.servicesInvoices.pathMatch + '/',
      },
      {
        type: ServicesSubItem.DAILY_ALLOWANCE,
        text: 'DAILY_ALLOWANCE',
        path: ROUTE_PATH.servicesDailyAllowance.pathMatch + '/',
      },
      {
        type: ServicesSubItem.CAPITAL_BENEFITS,
        text: 'CAPITAL_BENEFITS',
        path: ROUTE_PATH.servicesCapitalBenefits.pathMatch + '/',
      },
      {
        type: ServicesSubItem.RECLAIMS,
        text: 'RECLAIMS',
        path: ROUTE_PATH.servicesReclaims.pathMatch + '/',
      },
      {
        type: ServicesSubItem.CASES,
        text: 'CASES',
        path: ROUTE_PATH.servicesCases.pathMatch + '/',
      },
      {
        type: ServicesSubItem.COST_SHARING,
        text: 'COST_SHARING',
        path: ROUTE_PATH.servicesCostSharing.pathMatch + '/',
      },
      {
        type: ServicesSubItem.ASSIGNMENT_OF_CLAIMS,
        text: 'ASSIGNMENT_OF_CLAIMS',
        path: ROUTE_PATH.servicesAssignmentOfClaims.pathMatch + '/',
      },
      {
        type: ServicesSubItem.TRANSFER,
        text: 'TRANSFER',
        path: ROUTE_PATH.servicesTransfer.pathMatch + '/',
      },
      {
        type: ServicesSubItem.DISABILITY,
        text: 'DISABILITY',
        path: ROUTE_PATH.servicesDisability.pathMatch + '/',
      },
    ],
  },
  {
    type: PartnerCardItem.FINANCES,
    text: 'FINANCES',
    icon: IconMoney,
    filledIcon: IconMoneyFilled,
    subItems: [
      {
        type: FinancesSubItem.DEMAND,
        text: 'DEMAND',
        path: ROUTE_PATH.financesDemand.pathMatch + '/',
      },
      {
        type: FinancesSubItem.PAYMENT,
        text: 'PAYMENT',
        path: ROUTE_PATH.financesPayment.pathMatch + '/',
      },
    ],
  },
  {
    type: PartnerCardItem.DOCUMENTS,
    text: 'DOCUMENTS',
    icon: IconFileText,
    filledIcon: IconFileTextFilled,
    path: ROUTE_PATH.documents.pathMatch + '/',
    subItems: [],
  },
];
