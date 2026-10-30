import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';
import {IAuthResponse} from '@core/interfaces/api/IAuthResponse';
import {
  IAiSuggestionResponse,
  IAddProductionPayload,
  IBatchItem,
  ICreateProductPayload,
  IConfigureProductQrPayload,
  IConfigureProductQrResponse,
  IGenerateAiSuggestionPayload,
  IGetProductPayload,
  IProduct,
  IProductBatch,
  IProductResponse,
  IListBatchItemsPayload,
  IListProductBatchesPayload,
  IPaginatedResponse,
} from '@core/interfaces/api/IProduct';

export const buildListProductBatchesRequest = (payload: IListProductBatchesPayload) => ({
  url: `${APP_CONFIG.businessUrl}/business/ListProductBatches`,
  method: 'POST' as const,
  body: payload,
});

export const buildListBatchItemsRequest = (payload: IListBatchItemsPayload) => ({
  url: `${APP_CONFIG.businessUrl}/business/ListBatchItems`,
  method: 'POST' as const,
  body: payload,
});

export const buildConfigureProductQrRequest = (payload: IConfigureProductQrPayload) => ({
  url: `${APP_CONFIG.businessUrl}/business/ConfigureProductQr`,
  method: 'POST' as const,
  body: payload,
});

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['product', 'ProductBatch', 'BatchItem'],
  endpoints: builder => ({
    createProduct: builder.mutation<IAuthResponse, {payload: ICreateProductPayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/CreateProduct`,
        method: 'POST',
        body: mutation.payload,
      }),
      invalidatesTags: ['product', 'ProductBatch'],
    }),
    updateProduct: builder.mutation<IAuthResponse, {payload: IProduct}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/UpdateProduct`,
        method: 'POST',
        body: mutation.payload,
      }),
    }),
    deleteProduct: builder.mutation<IAuthResponse, {id: string}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/DeleteProduct`,
        method: 'POST',
        body: {
          ItemId: mutation.id,
        },
      }),
    }),
    getProduct: builder.query<IProductResponse, IGetProductPayload>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/GetProducts?page=${mutation.pageNumber}&size=${mutation.pageSize}`,
        method: 'POST',
        body: {
          ItemId: mutation.itemId,
          Category: mutation.category ?? '',
          SubCategory: mutation.subCategory ?? '',
          MinMakingPrice: mutation.minMakingPrice,
          MaxMakingPrice: mutation.maxMakingPrice,
          SearchTerm: mutation.searchTerm ?? '',
        },
      }),
      providesTags: () => [{type: 'product'}], // Cache by ID
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
      invalidatesTags: ['product', 'ProductBatch', 'BatchItem'],
    }),
    listProductBatches: builder.query<IPaginatedResponse<IProductBatch>, IListProductBatchesPayload>({
      query: buildListProductBatchesRequest,
      providesTags: (_result, _error, payload) => [
        {type: 'ProductBatch', id: payload.ProductId},
      ],
    }),
    listBatchItems: builder.query<IPaginatedResponse<IBatchItem>, IListBatchItemsPayload>({
      query: buildListBatchItemsRequest,
      providesTags: (_result, _error, payload) => [
        {type: 'BatchItem', id: payload.BatchId},
      ],
    }),
    configureProductQr: builder.mutation<IConfigureProductQrResponse, IConfigureProductQrPayload>({
      query: buildConfigureProductQrRequest,
      invalidatesTags: ['product'],
    }),
    generateAiSuggestion: builder.mutation<IAiSuggestionResponse, {payload: IGenerateAiSuggestionPayload}>({
      query: (mutation) => ({
        url: `${APP_CONFIG.businessUrl}/business/GenerateAiSuggestion`,
        method: 'POST',
        body: mutation.payload,
      }),
    }),
  }),
});

export const {
  useAddProductionMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGenerateAiSuggestionMutation,
  useGetProductQuery,
  useListProductBatchesQuery,
  useListBatchItemsQuery,
  useConfigureProductQrMutation,
} = productApi;
