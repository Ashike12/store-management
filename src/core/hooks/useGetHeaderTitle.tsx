import {ROUTE_PATH} from '@core/config/routePath';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export interface HeaderTitle {
  title: string;
  subTitle: string;
}

const useGetHeaderTitle = (): HeaderTitle => {
  const location = useLocation();
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const getHeaderTitleInfo = (pathName: string): void => {
    const path = pathName.split('/')[1];
    let pathCheck: string;

    if (path === 'customer') {
      pathCheck = path + '/' + pathName.split('/')[2];
    } else {
      pathCheck = path;
    }
    switch (pathCheck) {
      case ROUTE_PATH.dashBoard.pathMatch: {
        setTitle(ROUTE_PATH.dashBoard.title);
        setSubTitle(ROUTE_PATH.dashBoard.subTitle);
        return;
      }
      case ROUTE_PATH.task.pathMatch: {
        setTitle(ROUTE_PATH.task.title);
        setSubTitle(ROUTE_PATH.task.subTitle);
        return;
      }
      case ROUTE_PATH.customerOverview.pathMatch: {
        setTitle(ROUTE_PATH.customerOverview.title);
        setSubTitle(ROUTE_PATH.customerOverview.subTitle);
        return;
      }
      case ROUTE_PATH.customerSumary.pathMatch: {
        setTitle(ROUTE_PATH.customerSumary.title);
        setSubTitle(ROUTE_PATH.customerSumary.subTitle);
        return;
      }
      case ROUTE_PATH.customerInsuranceCard.pathMatch: {
        setTitle(ROUTE_PATH.customerInsuranceCard.title);
        setSubTitle(ROUTE_PATH.customerInsuranceCard.subtitle);
        return;
      }
      case ROUTE_PATH.customerCostSharing.pathMatch: {
        setTitle(ROUTE_PATH.customerCostSharing.title);
        setSubTitle(ROUTE_PATH.customerCostSharing.subtitle);
        return;
      }
      case ROUTE_PATH.customerRelationship.pathMatch: {
        setTitle(ROUTE_PATH.customerRelationship.title);
        setSubTitle(ROUTE_PATH.customerRelationship.subtitle);
        return;
      }
      case ROUTE_PATH.servicesOverview.pathMatch: {
        setTitle(ROUTE_PATH.servicesOverview.title);
        setSubTitle(ROUTE_PATH.servicesOverview.subtitle);
        return;
      }
      case ROUTE_PATH.servicesInvoices.pathMatch: {
        setTitle(ROUTE_PATH.servicesInvoices.title);
        setSubTitle(ROUTE_PATH.servicesInvoices.subtitle);
        return;
      }
      case ROUTE_PATH.servicesDailyAllowance.pathMatch: {
        setTitle(ROUTE_PATH.servicesDailyAllowance.title);
        setSubTitle(ROUTE_PATH.servicesDailyAllowance.subtitle);
        return;
      }
      case ROUTE_PATH.servicesCapitalBenefits.pathMatch: {
        setTitle(ROUTE_PATH.servicesCapitalBenefits.title);
        setSubTitle(ROUTE_PATH.servicesCapitalBenefits.subtitle);
        return;
      }
      case ROUTE_PATH.servicesReclaims.pathMatch: {
        setTitle(ROUTE_PATH.servicesReclaims.title);
        setSubTitle(ROUTE_PATH.servicesReclaims.subtitle);
        return;
      }
      case ROUTE_PATH.servicesCases.pathMatch: {
        setTitle(ROUTE_PATH.servicesCases.title);
        setSubTitle(ROUTE_PATH.servicesCases.subtitle);
        return;
      }
      case ROUTE_PATH.servicesCostSharing.pathMatch: {
        setTitle(ROUTE_PATH.servicesCostSharing.title);
        setSubTitle(ROUTE_PATH.servicesCostSharing.subtitle);
        return;
      }
      case ROUTE_PATH.servicesAssignmentOfClaims.pathMatch: {
        setTitle(ROUTE_PATH.servicesAssignmentOfClaims.title);
        setSubTitle(ROUTE_PATH.servicesAssignmentOfClaims.subtitle);
        return;
      }
      case ROUTE_PATH.servicesTransfer.pathMatch: {
        setTitle(ROUTE_PATH.servicesTransfer.title);
        setSubTitle(ROUTE_PATH.servicesTransfer.subtitle);
        return;
      }
      case ROUTE_PATH.servicesDisability.pathMatch: {
        setTitle(ROUTE_PATH.servicesDisability.title);
        setSubTitle(ROUTE_PATH.servicesDisability.subtitle);
        return;
      }
      case ROUTE_PATH.financesPayment.pathMatch: {
        setTitle(ROUTE_PATH.financesPayment.title);
        setSubTitle(ROUTE_PATH.financesPayment.subtitle);
        return;
      }
      case ROUTE_PATH.financesDemand.pathMatch: {
        setTitle(ROUTE_PATH.financesDemand.title);
        setSubTitle(ROUTE_PATH.financesDemand.subtitle);
        return;
      }
      case ROUTE_PATH.documents.pathMatch: {
        setTitle(ROUTE_PATH.documents.title);
        setSubTitle(ROUTE_PATH.documents.subtitle);
        return;
      }
      default: {
        setTitle('');
        setSubTitle('');
        return;
      }
    }
  };
  useEffect(() => {
    const pathName = structuredClone(location.pathname);
    getHeaderTitleInfo(pathName);
  }, [location.pathname]);
  return {title, subTitle};
};

export default useGetHeaderTitle;
