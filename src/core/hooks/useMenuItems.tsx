import {ROUTE_PATH} from '@core/config/routePath';
import {
  DASHBOARD_MENU_ITEM,
  IMenuItem,
  PARTNER_MENU_ITEM,
  TASK_MENU_ITEM,
} from '@core/utils/menuItems';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export type IModuleItemSelectType = 'TASK' | 'DASHBOARD' | 'PARTNER';

export default function useMenuItems() {
  const [menuItemClasses, setMenuItems] = useState<IMenuItem[]>([]);
  const [moduleItemSelectName, setModuleItemSelect] =
    useState<IModuleItemSelectType>('DASHBOARD');

  const location = useLocation();
  const pathName = location.pathname;

  const getInitialMenuItems = () => {
    const firstSegment = pathName.split('/')[1];
    switch (firstSegment) {
      case ROUTE_PATH.task.pathMatch:
        setModuleItemSelect('TASK');
        return setMenuItems(TASK_MENU_ITEM);
      case ROUTE_PATH.dashBoard.pathMatch:
        setModuleItemSelect('DASHBOARD');
        return setMenuItems(DASHBOARD_MENU_ITEM);
      default:
        setModuleItemSelect('PARTNER');
        return setMenuItems(PARTNER_MENU_ITEM);
    }
  };

  useEffect(() => {
    getInitialMenuItems();
  }, [pathName]);

  return {menuItems: menuItemClasses, moduleItemSelectName};
}
