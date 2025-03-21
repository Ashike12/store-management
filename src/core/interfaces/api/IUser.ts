export interface IUserResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IUser[];
}

export interface ICreateUserPayload {
    FirstName: string;
    LastName: string;
    Email: string;
    Address: string;
    Phone: string;
    Password?: string;
}

export interface IUser extends ICreateUserPayload {
    ItemId: string;
    Active: boolean;
    DisplayName: string;
    CreatedDate?: string;
}