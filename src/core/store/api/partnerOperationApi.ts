import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {generateUUID} from '@core/utils/uuid';
import {
  ICreatePartnerOperationPayload,
  ICreatePartnerOperationResponse,
} from '@features/partnerManagement/interfaces/create-partner-operation.interface';

const partnerOperationApiPath =
  APP_CONFIG.version1 + 'partner/operationen/partnererstellungen';

export const partnerOperationApi = createApi({
  reducerPath: 'partnerOperationApi',
  baseQuery: ApiServiceBaseQuery,
  keepUnusedDataFor: 120,
  endpoints: builder => ({
    createPartnerOperation: builder.mutation<
      ICreatePartnerOperationResponse,
      ICreatePartnerOperationPayload
    >({
      query: arg => {
        const operationId = generateUUID();
        return {
          url: partnerOperationApiPath + `/${operationId}`,
          method: 'PUT',
          body: arg,
        };
      },
    }),
  }),
});

export const {useCreatePartnerOperationMutation} = partnerOperationApi;
