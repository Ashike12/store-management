import {ROUTE_PATH} from '@core/config/routePath';

export const isEmployeeRole = (roles: string[]) => roles.includes('employee');
export const canManageEmployees = (roles: string[]) => roles.includes('admin');
export const authenticatedHomePath = (roles: string[]) =>
  isEmployeeRole(roles) ? ROUTE_PATH.employeePortal.path : ROUTE_PATH.dashBoard.path;

export const allowedEmployeeRoutePaths = (roles: string[]) =>
  isEmployeeRole(roles) ? new Set([ROUTE_PATH.employeePortal.path]) : null;
