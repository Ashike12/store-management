import {getEnvironment} from './getEnvironment';

const environment = getEnvironment();
export const CONFIG = {
  environment: environment?.ENVIRONMENT,
  baseUrl: environment?.BASE_URL,
  businessUrl: environment?.BUSINESS_URL,
} as IConfig;

export const APP_CONFIG = {
  ...CONFIG,
} as IConfig;

export interface IConfig {
  environment: 'DEV' | 'STG' | 'PROD';
  baseUrl: string;
  businessUrl: string;
}
