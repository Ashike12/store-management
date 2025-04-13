export interface IInvoiceResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IInvoice[] | InvoiceDetailsResponse;
}

export interface IInvoice {
    ItemId: string;
    InvoiceNumber?: string;
    CreatedDate?: string;
    WholeSalerId: string;
    WholeSalerName: string;
    TotalAmount: number;
    PaymentAmount: number;
    ProfitMargin: number;
    InvoiceType: string;
}

export interface ICreateInvoicePayload {
    PaymentAmount: number;
    WholeSalerId: string;
    ProductSellInfo: IProductSellInfo[];
}

export interface IUpdateInvoicePayload extends ICreateInvoicePayload {
    ItemId: string;
}

export interface IProductSellInfo {
    ItemId: string;
    ProductId: string;
    Quantity: number;
    SellingPrice: number;
    SellingDate: string;
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

export interface SalesEntry {
    revenue: number;
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
    SalesData: SalesEntry[];
    ProductSalesInfo: ProductSalesInfoEntry[];
    WholesalerData: WholesalerDataEntry[];
    ThisMonthRevenue: number;
    ThisMonthTotalInvoice: number;
    ThisMonthTotalSell: number;
    RecentInvoiceData: IInvoice[];
}

export interface IDashboardResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IDashboardData;
}