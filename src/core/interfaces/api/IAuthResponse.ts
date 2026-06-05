export interface IAuthResponse {
    login_token: string;
    refresh_token: string;
}

export interface IAuthTokenPayload {
    UserId?: string;
    UserName?: string;
    Roles?: string[];
    exp?: number;
    iat?: number;
}

export interface ISetPasswordResponse {
    statusCode: number;
    message: string;
    IsSuccess: boolean;
    errors: string;
}
