export interface IProductResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IProduct[];
}

export interface ICreateProductPayload {
    ProductName: string;
    Category: string;
    SubCategory: string;
    Description: string;
    ImageLinks: string[];
    VideoLink: string;
    MakingPrice: number;
    WholeSalerPrice: number;
    EndUserPrice: number;
    EndUserDiscountedPrice: number;
    Quantity: number;
}

export interface IProduct extends ICreateProductPayload {
    ItemId: string;
    CreatedDate?: string;
}



export interface IAddProductionPayload {
    ProductionInfo: IAddProduction[];
}

export interface IAddProduction {
    ProductId: string;
    Quantity: number;
}
