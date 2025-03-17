import {getEnvironment} from './getEnvironment';

const environment = getEnvironment();
export const CONFIG = {
  environment: environment?.ENVIRONMENT,
  baseUrl: environment?.BASE_URL,
  keyClock_Url: environment?.KEYCLOAK_URL,
  keyClockRealm: environment?.KEYCLOAK_REALM,
  keyClockClientId: environment?.KEYCLOAK_CLIENT_ID,
  version1: 'api/v1/',
} as IConfig;

export const APP_CONFIG = {
  ...CONFIG,
} as IConfig;

export interface IConfig {
  environment: 'DEV' | 'STG' | 'PROD';
  baseUrl: string;
  keyClock_Url: string;
  keyClockRealm: string;
  keyClockClientId: string;
  version1: string;
}
