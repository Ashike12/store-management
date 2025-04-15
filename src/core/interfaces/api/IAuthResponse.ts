export interface IAuthResponse {
    login_token: string;
    refresh_token: string;
}

export interface ISetPasswordResponse {
    statusCode: number;
    message: string;
    IsSuccess: boolean;
    errors: string;
}