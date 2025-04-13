import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import { ICreateInvoicePayload, IDashboardResponse, IInvoice, IInvoiceResponse } from '@core/interfaces/api/IInvoice';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['invoice'],
  endpoints: builder => ({
    createInvoice: builder.mutation<IAuthResponse, {payload: ICreateInvoicePayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/CreateInvoice`,
        method: 'POST',
        body: {...mutation.payload, InvoiceType: mutation.payload.WholeSalerId ? 'WHOLESALE': 'CONSUMER'},
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('Invoice-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    updateInvoice: builder.mutation<IAuthResponse, {payload: ICreateInvoicePayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/UpdateInvoice`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('Invoice-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    deleteInvoice: builder.mutation<IAuthResponse, {id: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/DeleteInvoice`,
        method: 'POST',
        body: {
          ItemId: mutation.id,
        },
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('Invoice-delete-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    getInvoice: builder.query<IInvoiceResponse, {pageNumber: number, pageSize: number, itemId: string, wholesalerId?: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/GetInvoice?page=${mutation.pageNumber}&size=${mutation.pageSize}`,
        method: 'POST',
        body: {
          ItemId: mutation.itemId,
          WholesalerId: mutation.wholesalerId,
        },
      }),
      providesTags: (_result, _error) => [{type: 'invoice'}], // Cache by ID
      transformResponse: (response: IInvoiceResponse) => {
        return response;
      },
    }),
    getDashboardData: builder.query<IDashboardResponse, {}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/GetDashboardData`,
        method: 'POST',
        body: {},
      }),
      providesTags: (_result, _error) => [{type: 'invoice'}], // Cache by ID
      transformResponse: (response: IDashboardResponse) => {
        return response;
      },
    })
  }),
});

export const {useCreateInvoiceMutation, useUpdateInvoiceMutation, useDeleteInvoiceMutation, useGetInvoiceQuery, useGetDashboardDataQuery} = invoiceApi;
