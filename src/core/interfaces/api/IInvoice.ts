export interface IInvoiceResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IInvoice[];
}

export interface ICreateInvoicePayload {
    WholesalerId: string;
    TotalAmount: number;
    PaymentAmount: number;
    ProfitMargin: number;
}

export interface IInvoice extends ICreateInvoicePayload {
    ItemId: string;
    CreatedDate?: string;
}
