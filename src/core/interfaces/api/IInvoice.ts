export interface IInvoiceResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IInvoice[];
}

export interface IInvoice {
    ItemId: string;
    CreatedDate?: string;
    WholeSalerId: string;
    WholeSalerName: string;
    TotalAmount: number;
    PaymentAmount: number;
    ProfitMargin: number;
}

export interface ICreateInvoicePayload {
    PaymentAmount: number;
    ProfitMargin: number;
    ProductSellInfo: IProductSellInfo[];
}

export interface IProductSellInfo {
    ProductId: string;
    Quantity: number;
    SellingPrice: number;
    SellingDate: number;
}
