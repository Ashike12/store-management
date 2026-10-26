export interface IProductResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IProduct[];
}

export interface IProductInput {
    ProductName: string;
    Category: string;
    SubCategory: string;
    NetHeight?: string;
    Description: string;
    ImageLinks: string[];
    VideoLink: string;
    MakingPrice: number;
    WholeSalerPrice: number;
    EndUserPrice: number;
    EndUserDiscountedPrice: number;
    Quantity: number;
}

export interface ICreateProductPayload extends IProductInput {
    RequestId: string;
}

export interface IProduct extends IProductInput {
    ItemId: string;
    CreatedDate?: string;
    QrVerificationEnabled?: boolean;
    QrVerificationUrl?: string | null;
}

export type ProductQrAction = 'enable' | 'disable' | 'rotate';

export interface IConfigureProductQrPayload {
    ItemId: string;
    Action: ProductQrAction;
}

export interface IConfigureProductQrResponse {
    IsSuccess: boolean;
    Data: {
        ItemId: string;
        QrVerificationEnabled: boolean;
        QrVerificationUrl: string | null;
    };
    ErrorMessage?: string;
}



export interface IAddProductionPayload {
    RequestId: string;
    ProductionInfo: IAddProduction[];
}

export interface IAddProduction {
    ProductId: string;
    Quantity: number;
}

export interface IProductBatch {
    BatchId: string;
    ProductId: string;
    QuantityReceived: number;
    CreatedBy?: string;
    CreatedDate: string;
}

export interface IBatchItem {
    SerialNumber: string;
    BatchId: string;
    ProductId: string;
    UnitIndex: number;
    CreatedDate: string;
}

export interface IPaginatedResponse<T> {
    IsSuccess: boolean;
    Data: T[];
    TotalCount: number;
    ErrorMessage?: string;
}

export interface IListProductBatchesPayload {
    ProductId: string;
    Page: number;
    Size: number;
}

export interface IListBatchItemsPayload {
    BatchId: string;
    Page: number;
    Size: number;
}

export interface IGetProductPayload {
    pageNumber: number;
    pageSize: number;
    itemId: string;
    category?: string;
    subCategory?: string;
    minMakingPrice?: number;
    maxMakingPrice?: number;
    searchTerm?: string;
}

export interface IGenerateAiSuggestionPayload {
    FieldName: string;
    CurrentValue?: string;
    ProductName?: string;
    Category?: string;
    SubCategory?: string;
    NetHeight?: string;
}

export interface IAiSuggestionResponse {
    IsSuccess: boolean;
    Data: {
        Suggestion: string;
    };
    ErrorMessage?: string;
}
