import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';

export interface FollowUpOrder {
  _id: string;
  OrderNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  Address: string;
  Area: string;
  District: string;
  Division: string;
  TotalAmount: number;
  ShippingCost: number;
  OrderStatus: string;
  PaymentStatus: 'unpaid';
  PaymentHandling: 'manual';
  RequiresImmediateAction: boolean;
  Version: number;
  Items: {ProductName: string; Quantity: number; UnitPrice: number}[];
}

interface OrderResponse<T> {
  IsSuccess: boolean;
  Data: T;
  TotalCount?: number;
}

export interface TransitionOrder {
  ItemId: string;
  Status: 'confirmed' | 'cancelled';
  ExpectedVersion: number;
  Note: string;
}

const request = (endpoint: string, body: object) => ({
  url: `${APP_CONFIG.businessUrl}/business/${endpoint}`,
  method: 'POST',
  body,
  // Business failures can be returned with HTTP 200.
  validateStatus: (response: Response, result: OrderResponse<unknown>) =>
    response.status >= 200 && response.status < 300 && result?.IsSuccess === true,
});

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: ApiServiceBaseQuery,
  tagTypes: ['FollowUpOrders'],
  keepUnusedDataFor: 0,
  endpoints: builder => ({
    listFollowUpOrders: builder.query<OrderResponse<FollowUpOrder[]>, {Page: number; Size: number}>({
      query: pagination => request('ListOrders', {...pagination, NeedsAction: true}),
      providesTags: ['FollowUpOrders'],
    }),
    getFollowUpOrder: builder.query<OrderResponse<FollowUpOrder>, string>({
      query: ItemId => request('GetOrder', {ItemId}),
      providesTags: ['FollowUpOrders'],
    }),
    transitionOrder: builder.mutation<OrderResponse<FollowUpOrder>, TransitionOrder>({
      query: body => request('TransitionOrder', body),
      invalidatesTags: ['FollowUpOrders'],
    }),
  }),
});

export const {useListFollowUpOrdersQuery, useGetFollowUpOrderQuery, useTransitionOrderMutation} = ordersApi;
