import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import { IAddProductionPayload, ICreateProductPayload, IProduct, IProductResponse } from '@core/interfaces/api/IProduct';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['product'],
  endpoints: builder => ({
    createProduct: builder.mutation<IAuthResponse, {payload: ICreateProductPayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/CreateProduct`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('product-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    updateProduct: builder.mutation<IAuthResponse, {payload: IProduct}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/UpdateProduct`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('product-create-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    deleteProduct: builder.mutation<IAuthResponse, {id: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/DeleteProduct`,
        method: 'POST',
        body: {
          ItemId: mutation.id,
        },
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('product-delete-data', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
    getProduct: builder.query<IProductResponse, {pageNumber: number, pageSize: number, itemId: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/GetProducts?page=${mutation.pageNumber}&size=${mutation.pageSize}`,
        method: 'POST',
        body: {
          ItemId: mutation.itemId
        },
      }),
      providesTags: (_result, _error) => [{type: 'product'}], // Cache by ID
      transformResponse: (response: IProductResponse) => {
        return response;
      },
    }),
    addProduction: builder.mutation<IAuthResponse, {payload: IAddProductionPayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/AddProduction`,
        method: 'POST',
        body: mutation.payload,
      }),
      async onQueryStarted(id, {dispatch, queryFulfilled}) {
        // `onStart` side-effectdispatch(messageCreated('Fetching post...'))
        try {
          const {data} = await queryFulfilled;
          console.log('production-added', data);
        } catch (err) {
          // `onError` side-effectdispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
  }),
});

export const {useAddProductionMutation, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetProductQuery} = productApi;
