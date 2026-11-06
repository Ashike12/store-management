import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import {
  ICreateInvoicePayload,
  IDashboardResponse,
  IListSalesUsersResponse,
  IInvoiceResponse,
  ISalesHistoryRequest,
  ISalesHistoryResponse,
  IUpdateInvoicePayload,
} from '@core/interfaces/api/IInvoice';

export const buildInvoiceBusinessRequest = <T,>(name: string, body: T) => ({
  url: `${APP_CONFIG.businessUrl}/business/${name}`,
  method: 'POST' as const,
  body,
});

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['invoice'],
  endpoints: builder => ({
    createInvoice: builder.mutation<IAuthResponse, {payload: ICreateInvoicePayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/CreateInvoice`,
        method: 'POST',
        body: {
          ...mutation.payload,
          InvoiceType: mutation.payload.InvoiceType || (mutation.payload.WholeSalerId ? 'WHOLESALE' : 'CONSUMER'),
        },
      }),
      invalidatesTags: ['invoice'],
    }),
    updateInvoice: builder.mutation<IAuthResponse, {payload: IUpdateInvoicePayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/UpdateInvoice`,
        method: 'POST',
        body: mutation.payload,
      }),
      invalidatesTags: ['invoice'],
    }),
    deleteInvoice: builder.mutation<IAuthResponse, {id: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/DeleteInvoice`,
        method: 'POST',
        body: {
          ItemId: mutation.id,
        },
      }),
      invalidatesTags: ['invoice'],
    }),
    getInvoice: builder.query<IInvoiceResponse, {pageNumber: number, pageSize: number, itemId: string, wholesalerId?: string}>({
      query: mutation => ({
        url: `${APP_CONFIG.businessUrl}/business/GetInvoice?page=${mutation.pageNumber}&size=${mutation.pageSize}`,
        method: 'POST',
        body: {
          ItemId: mutation.itemId,
          WholesalerId: mutation.wholesalerId,
        },
      }),
      providesTags: ['invoice'], // Cache by ID
      transformResponse: (response: IInvoiceResponse) => {
        return response;
      },
    }),
    getDashboardData: builder.query<IDashboardResponse, Record<string, never>>({
      query: () => ({
        url: `${APP_CONFIG.businessUrl}/business/GetDashboardData`,
        method: 'POST',
        body: {},
      }),
      providesTags: ['invoice'], // Cache by ID
      transformResponse: (response: IDashboardResponse) => {
        return response;
      },
    }),
    listSalesUsers: builder.query<IListSalesUsersResponse, void>({
      query: () => buildInvoiceBusinessRequest('ListSalesUsers', {}),
    }),
    getSalesHistory: builder.query<
      ISalesHistoryResponse,
      ISalesHistoryRequest
    >({
      query: payload => buildInvoiceBusinessRequest('GetSalesHistory', payload),
      providesTags: ['invoice'],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoiceQuery,
  useGetDashboardDataQuery,
  useListSalesUsersQuery,
  useGetSalesHistoryQuery,
} = invoiceApi;
