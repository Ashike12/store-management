import {ISalesUser} from '@core/interfaces/api/IInvoice';

export const resolveInitialSalesUserId = (
  currentUserId: string,
  salesUsers: ISalesUser[],
) =>
  salesUsers.some(user => user.ItemId === currentUserId) ? currentUserId : '';
