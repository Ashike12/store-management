import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {constructQueryParams} from '@core/utils/queryParams';
import {
  IGetBuildAddressQuery,
  IGetHouseNumberQuery,
  IGetPostalCodesQuery,
  IGetStreetNameQuery,
} from '@features/partnerManagement/interfaces/partner-address.interface';

const partnerAddressApiPath = APP_CONFIG.version1 + 'partner/referenzdaten';

const paths = {
  streets: partnerAddressApiPath + '/strassen',
  housenumbers: partnerAddressApiPath + '/hausnummern',
  places: partnerAddressApiPath + '/ortschaften',
  buildAddress: partnerAddressApiPath + '/gebaeudeadressen',
} as const;

export const partnerAddressApi = createApi({
  reducerPath: 'partnerAddressApi',
  baseQuery: ApiServiceBaseQuery,
  keepUnusedDataFor: 120,
  tagTypes: ['partnerStreet', 'partnerHouse', 'partnerPostalCodeAndPlace'],
  endpoints: builder => ({
    streets: builder.infiniteQuery<
      IGetStreetNameQuery,
      {searchQuery: string; plz?: string},
      {
        pageSize: number;
        cursor?: string;
      }
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          pageSize: 10,
          cursor: undefined,
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
          paths.streets +
          constructQueryParams({
            q: queryArg.searchQuery,
            plz: queryArg.plz,
            cursor: pageParam.cursor,
            pageSize: pageParam.pageSize,
          })
        );
      },
    }),
    houseNames: builder.infiniteQuery<
      IGetHouseNumberQuery,
      {searchQuery: string; strasse: string; plz?: string},
      {
        pageSize: number;
        cursor?: string;
      }
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          pageSize: 10,
          cursor: undefined,
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
          paths.housenumbers +
          constructQueryParams({
            q: queryArg.searchQuery,
            strasse: queryArg.strasse,
            plz: queryArg.plz,
            cursor: pageParam.cursor,
            pageSize: pageParam.pageSize,
          })
        );
      },
    }),

    postalCodes: builder.infiniteQuery<
      IGetPostalCodesQuery,
      {searchQuery: string},
      {
        pageSize: number;
        cursor?: string;
      }
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          pageSize: 20,
          cursor: undefined,
        },
        getNextPageParam: lastPage => {
          if (!lastPage.metadata.nextCursor) {
            return undefined;
          }
          return {
            cursor: lastPage.metadata.nextCursor,
            pageSize: 20,
          };
        },
      },
      query: ({queryArg, pageParam}) => {
        return (
          paths.places +
          constructQueryParams({
            q: queryArg.searchQuery,
            cursor: pageParam.cursor,
            pageSize: pageParam.pageSize,
          })
        );
      },
    }),
    buildAddress: builder.query<
      IGetBuildAddressQuery,
      {strasse: string; plz: string; hausnummer: string}
    >({
      query: arg => {
        return (
          paths.buildAddress +
          constructQueryParams({
            strasse: arg.strasse,
            plz: arg.plz,
            hausnummer: arg.hausnummer,
          })
        );
      },
    }),
  }),
});

export const {
  useStreetsInfiniteQuery,
  useHouseNamesInfiniteQuery,
  usePostalCodesInfiniteQuery,
  useBuildAddressQuery,
  useLazyBuildAddressQuery,
} = partnerAddressApi;
