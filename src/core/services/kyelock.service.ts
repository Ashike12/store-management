import {
  AUTH_REDIRECT_URL,
  KEY_CLOCK_LOGOUT_URL,
  KEY_CLOCK_REFRESH_URL,
} from '@core/config/keyclock';
import {ClientHttpService} from './http.service';
import {APP_CONFIG} from '@core/config/config';
import {KeyclockRefreshTokenResponse} from '@core/interfaces/keyClock.mode';
import {IToken} from '@core/interfaces/auth.model';

class KeyclockService {
  async refreshToken(refreshToken: string) {
    const url = KEY_CLOCK_REFRESH_URL;
    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'refresh_token');
    urlencoded.append('refresh_token', refreshToken);
    urlencoded.append('client_id', APP_CONFIG.keyClockClientId);

    const response =
      await ClientHttpService.postURLencoded<KeyclockRefreshTokenResponse>(
        url,
        urlencoded,
      );
    return response;
  }

  async logout(token: IToken) {
    const url = KEY_CLOCK_LOGOUT_URL;
    const formData = new URLSearchParams();
    formData.append('client_id', APP_CONFIG.keyClockClientId);
    formData.append('refresh_token', token.refreshToken);
    const response =
      await ClientHttpService.postURLencoded<KeyclockRefreshTokenResponse>(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        },
      );
    return response;
  }

  async exchangeCodeForToken(authCode: string): Promise<IToken | null> {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', APP_CONFIG.keyClockClientId);
      formData.append('code', authCode);
      formData.append('redirect_uri', AUTH_REDIRECT_URL);
      const response = await ClientHttpService.postURLencoded(
        KEY_CLOCK_REFRESH_URL,
        formData,
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        },
      );
      const {access_token, refresh_token, id_token} =
        response?.data || ({} as any);
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        idToken: id_token,
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return null;
    }
  }
}
export const KeyclockHttpService = new KeyclockService();
