export interface IInvoiceResponse {
  IsSuccess: boolean;
  TotalCount: number;
  Data: IInvoice[] | InvoiceDetailsResponse;
  Summary?: IInvoiceFinancialSummary;
}

export interface IInvoice {
  ItemId: string;
  InvoiceNumber?: string;
  CreatedDate?: string;
  WholeSalerId: string;
  WholeSalerName: string;
  TotalAmount: number;
  PaymentAmount: number;
  ProductCostAmount?: number;
  GrossProfit?: number;
  RealizedCashMargin?: number;
  InvoiceType: string;
  SoldByUserId?: string;
  SoldByUserName?: string;
}

export interface ICreateInvoicePayload {
  PaymentAmount: number;
  WholeSalerId: string;
  InvoiceType: string;
  ProductSellInfo: IProductSellInfo[];
  SoldByUserId: string;
}

export interface IUpdateInvoicePayload extends ICreateInvoicePayload {
  ItemId: string;
}

export interface IProductSellInfo {
  ItemId?: string;
  ProductId: string;
  Quantity: number;
  SellingPrice: number;
  SellingDate?: string;
}

export interface IProductSellInfoResponse extends IProductSellInfo {
  CreatedDate: string;
  ItemId: string;
  ProductId: string;
  ProductName: string;
  WholeSalerId: string;
  WholeSalerName: string;
}

export interface InvoiceDetailsResponse extends IInvoice {
  ProductSellInfo: IProductSellInfoResponse[];
}

export interface CashMarginEntry {
  cashCollected: number;
  realizedCashMargin: number;
  date: string; // Format: 'YYYY-MM-DD'
}

export interface ProductSalesInfoEntry {
  sales: number;
  name: string;
}

export interface WholesalerDataEntry {
  value: number;
  name: string;
}

export interface IDashboardData {
  CashMarginData?: CashMarginEntry[];
  ProductSalesInfo?: ProductSalesInfoEntry[];
  CashCollectedByWholesaler?: WholesalerDataEntry[];
  ThisMonthCashCollected?: number;
  ThisMonthGrossProfit?: number;
  ThisMonthRealizedCashMargin?: number;
  ThisMonthTotalInvoice: number;
  ThisMonthTotalSell?: number;
  TotalOutstandingDue: number;
  TotalCustomerCredit: number;
  TotalCostAtRisk?: number;
  RecentInvoiceData: IInvoice[];
}

export interface IInvoiceFinancialSummary {
  TotalBilled: number;
  ProductCostAmount?: number;
  CashCollected: number;
  GrossProfit?: number;
  RealizedCashMargin?: number;
  OutstandingDue: number;
  CustomerCredit: number;
  CostAtRisk?: number;
}

export type SalesHistoryPeriod =
  | 'daily'
  | 'last7Days'
  | 'last30Days'
  | 'currentMonth';

export interface ISalesUser {
  ItemId: string;
  DisplayName: string;
  Email: string;
  Roles: string[];
}

export interface IListSalesUsersResponse {
  IsSuccess: boolean;
  TotalCount: number;
  Data: ISalesUser[];
}

export interface ISalesHistoryRequest {
  Period: SalesHistoryPeriod;
  SoldByUserId?: string;
  Page: number;
  Size: number;
}

export interface ISalesHistoryRow {
  ItemId: string;
  InvoiceNumber: string;
  CreatedDate: string;
  InvoiceType: string;
  WholeSalerName: string;
  SoldByUserId: string;
  SoldByUserName: string;
  TotalAmount: number;
  PaymentAmount: number;
  DueAmount: number;
  GrossProfit: number;
}

export interface ISalesByPerson {
  SoldByUserId: string;
  SoldByUserName: string;
  InvoiceCount: number;
  TotalSales: number;
}

export interface IDailySalesTrend {
  Date: string;
  TotalSales: number;
  InvoiceCount: number;
}

export interface ISalesHistorySummary {
  Period: SalesHistoryPeriod;
  StartDate: string;
  EndDateExclusive: string;
  InvoiceCount: number;
  TotalSales: number;
  TotalReceived: number;
  OutstandingDue: number;
  GrossProfit: number;
  SalesByPerson: ISalesByPerson[];
  DailyTrend: IDailySalesTrend[];
}

export interface ISalesHistoryResponse {
  IsSuccess: boolean;
  TotalCount: number;
  Data: ISalesHistoryRow[];
  Summary: ISalesHistorySummary;
}

export interface IDashboardResponse {
  IsSuccess: boolean;
  TotalCount: number;
  Data: IDashboardData;
}
