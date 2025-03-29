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
}

export interface ICreateInvoicePayload {
    PaymentAmount: number;
    WholeSalerId: string;
    ProductSellInfo: IProductSellInfo[];
}

export interface IProductSellInfo {
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
