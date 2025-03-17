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
    const pathCheck = pathName.split('/')[1];

    switch (pathCheck) {
      case ROUTE_PATH.dashBoard.pathMatch: {
        setTitle(ROUTE_PATH.dashBoard.title);
        setSubTitle(ROUTE_PATH.dashBoard.subTitle);
        return;
      }
      case ROUTE_PATH.store.pathMatch: {
        setTitle(ROUTE_PATH.store.title);
        setSubTitle(ROUTE_PATH.store.subTitle);
        return;
      }
      case ROUTE_PATH.wholesalers.pathMatch: {
        setTitle(ROUTE_PATH.wholesalers.title);
        setSubTitle(ROUTE_PATH.wholesalers.subTitle);
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
