export interface IProductResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IProduct[];
}

export interface ICreateProductPayload {
    ProductName: string;
    Description: string;
    MakingPrice: number;
    SellingPrice: number;
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
