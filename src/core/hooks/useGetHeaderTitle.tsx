import {ROUTE_PATH} from '@core/config/routePath';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export interface HeaderTitle {
  title: string;
  subTitle: string;
  backButtonPath: string;
}

const useGetHeaderTitle = (): HeaderTitle => {
  const location = useLocation();
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [backButtonPath, setbackButtonPath] = useState<any>('');
  const getHeaderTitleInfo = (pathName: string): void => {
    const path = pathName.split('/')[1];
    let pathCheck: string;

    if (path === 'invoice' && !!pathName.split('/')[2]) {
      pathCheck = path + '/' + pathName.split('/')[2];
    }else if (path === 'wholesaler' && !!pathName.split('/')[2]) {
      pathCheck = path + '/' + pathName.split('/')[2];
    } else {
      pathCheck = path;
    }

    console.log('pathCheck', pathCheck);

    switch (pathCheck) {
      case ROUTE_PATH.dashBoard.pathMatch: {
        setTitle(ROUTE_PATH.dashBoard.title);
        setSubTitle(ROUTE_PATH.dashBoard.subTitle);
        setbackButtonPath(ROUTE_PATH.dashBoard.backButtonRoute);
        return;
      }
      case ROUTE_PATH.store.pathMatch: {
        setTitle(ROUTE_PATH.store.title);
        setSubTitle(ROUTE_PATH.store.subTitle);
        setbackButtonPath(ROUTE_PATH.store.backButtonRoute);
        return;
      }
      case ROUTE_PATH.wholesalers.pathMatch: {
        setTitle(ROUTE_PATH.wholesalers.title);
        setSubTitle(ROUTE_PATH.wholesalers.subTitle);
        setbackButtonPath(ROUTE_PATH.wholesalers.backButtonRoute);
        return;
      }
      case ROUTE_PATH.wholesalerDetails.pathMatch: {
        setTitle(ROUTE_PATH.wholesalerDetails.title);
        setSubTitle(ROUTE_PATH.wholesalerDetails.subTitle);
        setbackButtonPath(ROUTE_PATH.wholesalerDetails.backButtonRoute);
        return;
      }
      case ROUTE_PATH.invoice.pathMatch: {
        setTitle(ROUTE_PATH.invoice.title);
        setSubTitle(ROUTE_PATH.invoice.subTitle);
        setbackButtonPath(ROUTE_PATH.invoice.backButtonRoute);
        return;
      }
      case ROUTE_PATH.invoiceAdd.pathMatch: {
        setTitle(ROUTE_PATH.invoiceAdd.title);
        setSubTitle(ROUTE_PATH.invoiceAdd.subTitle);
        setbackButtonPath(ROUTE_PATH.invoiceAdd.backButtonRoute);
        return;
      }
      case ROUTE_PATH.invoiceUpdate.pathMatch: {
        setTitle(ROUTE_PATH.invoiceUpdate.title);
        setSubTitle(ROUTE_PATH.invoiceUpdate.subTitle);
        setbackButtonPath(ROUTE_PATH.invoiceUpdate.backButtonRoute);
        return;
      }
      case ROUTE_PATH.invoiceDetails.pathMatch: {
        setTitle(ROUTE_PATH.invoiceDetails.title);
        setSubTitle(ROUTE_PATH.invoiceDetails.subTitle);
        setbackButtonPath(ROUTE_PATH.invoiceDetails.backButtonRoute);
        return;
      }
      default: {
        setTitle('');
        setSubTitle('');
        setbackButtonPath(null);
        return;
      }
    }
  };
  useEffect(() => {
    const pathName = structuredClone(location.pathname);
    getHeaderTitleInfo(pathName);
  }, [location.pathname]);
  return {title, subTitle, backButtonPath};
};

export default useGetHeaderTitle;
