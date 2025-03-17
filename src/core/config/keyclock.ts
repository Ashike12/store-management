import {APP_CONFIG} from '@core/config/config';

export const AUTH_REDIRECT_URL = window.location.origin + '/callback';

const CONNET_URL = `${APP_CONFIG.keyClock_Url}realms/${APP_CONFIG.keyClockRealm}/protocol/openid-connect`;

export const KEY_CLOCK_REFRESH_URL = `${CONNET_URL}/token`;

export const KEY_CLOCK_AUTH_URL = `${CONNET_URL}/auth?client_id=${APP_CONFIG.keyClockClientId}&redirect_uri=${
  AUTH_REDIRECT_URL
}&response_type=code&scope=openid`;

export const KEY_CLOCK_LOGOUT_URL = `${CONNET_URL}/logout`;
