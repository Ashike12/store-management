import {EnumRightSidebarMenuItem} from '@core/enums/right-sidebar-item.enum';
import IconKanbanOutline from '@assets/icons/IconKanbanOutline';
import IconNoteOutline from '@assets/icons/IconNoteOutline';
import IconKanbanFilled from '@assets/icons/IconKanbanFilled';
import IconUserSquareFilled from '@assets/icons/IconUserSquareFilled';
import IconUserSquareOutline from '@assets/icons/IconUserSquareOutline';
import IconNoteFilled from '@assets/icons/IconNoteFilled';
import NotesDrawer from '@features/dashboard/components/NotesDrawer';
import PartnerNotesDrawer from '@features/customer/components/NotesDrawer';
import TasksDrawer from '@features/dashboard/components/TasksDrawer';
import PartnerContractDrawer from '@features/customer/components/ContactsDrawer';

import ContactsDrawer from '@features/dashboard/components/ContactsDrawer';
import {ComponentType} from 'react';
import {ICustomIconProps} from '@core/interfaces/icon.interface';
import IconAlignCenterHorizontalOutline from '@assets/icons/IconAlignCenterHorizontalOutline';
import IconScrollOutline from '@assets/icons/IconScrollOutline';
import IconScrollFilled from '@assets/icons/IconScrollFilled';
import IconAlignCenterHorizontalFilled from '@assets/icons/IconAlignCenterHorizontalFilled';
import Timeline from '@features/customer/components/Timeline';

export interface IMenuItem {
  Type: EnumRightSidebarMenuItem;
  OutlineIcon: ComponentType<ICustomIconProps>;
  FilledIcon: ComponentType<ICustomIconProps>;
  DrawerComponent: ComponentType<any>;
}

export const DASHBOARD_MENU_ITEM: IMenuItem[] = [
  {
    Type: EnumRightSidebarMenuItem.NOTES,
    OutlineIcon: IconNoteOutline,
    FilledIcon: IconNoteFilled,
    DrawerComponent: NotesDrawer,
  },
  {
    Type: EnumRightSidebarMenuItem.TASK,
    OutlineIcon: IconKanbanOutline,
    FilledIcon: IconKanbanFilled,
    DrawerComponent: TasksDrawer,
  },
  {
    Type: EnumRightSidebarMenuItem.CONTACTS,
    OutlineIcon: IconUserSquareOutline,
    FilledIcon: IconUserSquareFilled,
    DrawerComponent: ContactsDrawer,
  },
];

export const TASK_MENU_ITEM: IMenuItem[] = [
  {
    Type: EnumRightSidebarMenuItem.NOTES,
    OutlineIcon: IconNoteOutline,
    FilledIcon: IconNoteFilled,
    DrawerComponent: NotesDrawer,
  },
  {
    Type: EnumRightSidebarMenuItem.TASK,
    OutlineIcon: IconKanbanOutline,
    FilledIcon: IconKanbanFilled,
    DrawerComponent: TasksDrawer,
  },
  {
    Type: EnumRightSidebarMenuItem.CONTACTS,
    OutlineIcon: IconUserSquareOutline,
    FilledIcon: IconUserSquareFilled,
    DrawerComponent: ContactsDrawer,
  },
];

export const PARTNER_MENU_ITEM: IMenuItem[] = [
  {
    Type: EnumRightSidebarMenuItem.NOTES,
    OutlineIcon: IconNoteOutline,
    FilledIcon: IconNoteFilled,
    DrawerComponent: PartnerNotesDrawer,
  },
  {
    Type: EnumRightSidebarMenuItem.TIMELINE,
    OutlineIcon: IconAlignCenterHorizontalOutline,
    FilledIcon: IconAlignCenterHorizontalFilled,
    DrawerComponent: Timeline,
  },
  {
    Type: EnumRightSidebarMenuItem.CONTACTS,
    OutlineIcon: IconScrollOutline,
    FilledIcon: IconScrollFilled,
    DrawerComponent: PartnerContractDrawer,
  },
];
