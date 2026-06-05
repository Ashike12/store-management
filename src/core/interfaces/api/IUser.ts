export interface IUserResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IUser[];
}

export interface IUserDetailsResponse {
    IsSuccess: boolean;
    TotalCount: number;
    Data: IUser;
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
    DateOfBirth?: string | Date | null;
    CreatedDate?: string;
}

export interface IUpdateProfilePayload {
    FirstName: string;
    LastName: string;
    DisplayName: string;
    Phone: string;
    Address: string;
    DateOfBirth?: string | Date | null;
}

export interface IChangePasswordPayload {
    CurrentPassword: string;
    NewPassword: string;
}
