import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {APP_CONFIG} from '@core/config/config';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type OrderUpdateChannel = 'Email' | 'PhoneCall' | 'Messaging';

export interface OrderItem {
  ProductId?: string;
  ProductName: string;
  Category?: string;
  SubCategory?: string;
  ImageLinks?: string[];
  Quantity: number;
  UnitPrice: number;
  CustomOptions?: Record<string, string>;
  InventoryRequirements?: {ProductId: string; Quantity: number}[];
}

export interface OrderAuditEntry {
  From: string;
  To: string;
  By: string;
  At: string;
  Note: string;
  EventType?: 'order_info_updated';
  UpdateDoneBy?: OrderUpdateChannel;
  ChangedFields?: string[];
}

export interface OrderStockMovement {
  ProductId: string;
  Quantity: number;
}

export interface FollowUpOrder {
  _id: string;
  OrderNumber: string;
  CustomerName: string;
  PhoneNumber: string;
  Address: string;
  Area: string;
  District: string;
  Division: string;
  PostCode?: string;
  DeliveryNotes?: string;
  DeliveryZone?: string;
  Subtotal?: number;
  CouponCode?: string;
  CouponDiscount?: number;
  TotalAmount: number;
  ShippingCost: number;
  OrderStatus: OrderStatus;
  PaymentStatus: PaymentStatus;
  PaymentHandling: 'manual';
  RequiresImmediateAction: boolean;
  StockDeducted?: boolean;
  FormulaVersion?: string;
  CreatedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  Version: number;
  Items: OrderItem[];
  StockMovements?: OrderStockMovement[];
  AuditHistory?: OrderAuditEntry[];
}

export interface OrderResponse<T> {
  IsSuccess: boolean;
  Data: T;
  TotalCount?: number;
}

export interface TransitionOrder {
  ItemId: string;
  Status: Exclude<OrderStatus, 'pending'>;
  ExpectedVersion: number;
  Note?: string;
}

export interface UpdateOrderInfo {
  ItemId: string;
  ExpectedVersion: number;
  CustomerName: string;
  PhoneNumber: string;
  Division: string;
  District: string;
  Area: string;
  PostCode: string;
  Address: string;
  DeliveryNotes?: string;
  DeliveryZone: 'inside_dhaka' | 'outside_dhaka';
  UpdateDoneBy: OrderUpdateChannel;
  Note?: string;
}

export interface ListOrdersRequest {
  Page: number;
  Size: number;
  NeedsAction?: boolean;
  Status?: OrderStatus;
  Search?: string;
  From?: string;
  To?: string;
}

const request = (endpoint: string, body: object) => ({
  url: `${APP_CONFIG.businessUrl}/business/${endpoint}`,
  method: 'POST',
  body,
  // Business failures can be returned with HTTP 200.
  validateStatus: (response: Response, result: OrderResponse<unknown>) =>
    response.status >= 200 &&
    response.status < 300 &&
    result?.IsSuccess === true,
});

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: ApiServiceBaseQuery,
  tagTypes: ['FollowUpOrders'],
  keepUnusedDataFor: 0,
  endpoints: builder => ({
    listFollowUpOrders: builder.query<
      OrderResponse<FollowUpOrder[]>,
      {Page: number; Size: number}
    >({
      query: pagination =>
        request('ListOrders', {...pagination, NeedsAction: true}),
      providesTags: ['FollowUpOrders'],
    }),
    listOrders: builder.query<
      OrderResponse<FollowUpOrder[]>,
      ListOrdersRequest
    >({
      query: filters => request('ListOrders', filters),
      providesTags: ['FollowUpOrders'],
    }),
    getFollowUpOrder: builder.query<OrderResponse<FollowUpOrder>, string>({
      query: ItemId => request('GetOrder', {ItemId}),
      providesTags: ['FollowUpOrders'],
    }),
    transitionOrder: builder.mutation<
      OrderResponse<FollowUpOrder>,
      TransitionOrder
    >({
      query: body => request('TransitionOrder', body),
      invalidatesTags: ['FollowUpOrders'],
    }),
    updateOrderInfo: builder.mutation<
      OrderResponse<FollowUpOrder>,
      UpdateOrderInfo
    >({
      query: body => request('UpdateOrderInfo', body),
      invalidatesTags: ['FollowUpOrders'],
    }),
  }),
});

export const {
  useListFollowUpOrdersQuery,
  useListOrdersQuery,
  useGetFollowUpOrderQuery,
  useTransitionOrderMutation,
  useUpdateOrderInfoMutation,
} = ordersApi;
