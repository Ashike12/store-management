import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IGetPartnerSearchResultData} from '@features/partnerSearch/interfaces/partner-search-result.interface';
import {constructQueryParams} from '@core/utils/queryParams';

const partnerSearchPath = APP_CONFIG.version1 + 'query/partner';

export const partnerSearchApi = createApi({
  reducerPath: 'partnerSearchApi',
  baseQuery: ApiServiceBaseQuery,
  keepUnusedDataFor: 120,
  tagTypes: ['partners'],
  endpoints: builder => ({
    partnersWithSearch: builder.infiniteQuery<
      IGetPartnerSearchResultData,
      {searchQuery: string},
      {
        pageSize: number;
        cursor?: string;
      }
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          pageSize: 10,
        },
        getNextPageParam: lastPage => {
          if (!lastPage.metadata.nextCursor) {
            return undefined;
          }
          return {
            cursor: lastPage.metadata.nextCursor,
            pageSize: 10,
          };
        },
      },
      query: ({queryArg, pageParam}) => {
        return (
          partnerSearchPath +
          constructQueryParams({
            q: queryArg.searchQuery,
            orderBy: 'name',
            pagination: {
              cursor: pageParam.cursor,
              pageSize: pageParam.pageSize,
            },
          })
        );
      },
    }),
  }),
});

export const {usePartnersWithSearchInfiniteQuery} = partnerSearchApi;
