import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import {APP_CONFIG} from '@core/config/config';

// Function to get the current access token
const getToken = () => 'token';

// Function to refresh the token
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${APP_CONFIG.businessUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Ensures cookies are sent (if needed)
    });

    if (!response.ok) {
      throw new Error('Refresh token request failed');
    }

    const data = await response.json();
    //  setAnonymousCookieToken(data.accessToken); // Save new token
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // removeAuthCookieToken(); // Clear tokens if refresh fails
    return null;
  }
};

// Create a custom baseQuery to handle token refresh
const customBaseQuery =
  (
    baseUrl: string,
  ): BaseQueryFn<
    string | FetchArgs, // Request URL or object
    unknown, // Response type (you can change this to match API response)
    FetchBaseQueryError, // Error type
    object, // Extra options type (optional)
    FetchBaseQueryMeta // Meta type (optional)
  > =>
  async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: async headers => {
        const token = await getToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
    });

    let result = await baseQuery(args, api, extraOptions);

    // If Unauthorized (401), attempt to refresh token
    if (result.error && result.error.status === 401) {
      console.warn('Unauthorized! Attempting token refresh...');

      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.error('Token refresh failed. Logging out...');
        //  api.dispatch({type: 'auth/logout'}); // Dispatch logout action
      }
    }

    return result;
  };

// Export different base queries
export const ApiServiceBaseQuery = customBaseQuery(APP_CONFIG.baseUrl);
// export const identityBaseQuery = customBaseQuery(APP_CONFIG.identityUrl);
