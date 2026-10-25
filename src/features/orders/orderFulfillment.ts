import {ListOrdersRequest, OrderStatus} from '@core/store/api/ordersApi';

export type OrderStatusFilter = 'all' | OrderStatus;

export function canAccessOrderFulfillment(roles: string[]) {
  return roles.includes('admin');
}

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function getValidOrderTransitions(status: OrderStatus): OrderStatus[] {
  return ORDER_TRANSITIONS[status];
}

function asIsoBoundary(value: string, endOfDay: boolean) {
  if (!value) return undefined;
  const date = new Date(
    `${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`,
  );
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function buildOrdersRequest({
  page,
  status,
  search,
  from,
  to,
  needsAction,
}: {
  page: number;
  status: OrderStatusFilter;
  search: string;
  from: string;
  to: string;
  needsAction: boolean;
}): ListOrdersRequest {
  const request: ListOrdersRequest = {Page: page, Size: 10};
  const normalizedSearch = search.trim();
  if (status !== 'all') request.Status = status;
  if (normalizedSearch) request.Search = normalizedSearch;
  const fromIso = asIsoBoundary(from, false);
  const toIso = asIsoBoundary(to, true);
  if (fromIso) request.From = fromIso;
  if (toIso) request.To = toIso;
  if (needsAction) request.NeedsAction = true;
  return request;
}

export function isConflictError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 409,
  );
}
