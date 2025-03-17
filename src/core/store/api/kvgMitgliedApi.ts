import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IKVGMitgliedResponse} from '@core/interfaces/api/kvgMitglied.model';

const paths = {
  kvgMitglied: APP_CONFIG.version1 + 'kvg/',
};

export const kvgMitgliedApi = createApi({
  reducerPath: 'kvgMitgliedApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['kvgMitglied'],
  keepUnusedDataFor: 120, //  Keep unused data in cache for 120 seconds (2 mins)
  endpoints: builder => ({
    // GET Kvg data by partner ID
    getKvgDataByPartnerId: builder.query<IKVGMitgliedResponse, string>({
      query: id => paths.kvgMitglied + `mitglieder/${id}`,
      providesTags: (result, error, id) => [{type: 'kvgMitglied', id}], // Cache by ID
      transformResponse: (response: IKVGMitgliedResponse) => {
        return response as IKVGMitgliedResponse;
      },
    }),
  }),
});

export const {useGetKvgDataByPartnerIdQuery} = kvgMitgliedApi;
