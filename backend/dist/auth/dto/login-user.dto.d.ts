export declare class CreateUserDto {
    firstName: string;
    lastName: string;
}
export declare class LoginUserDto {
    username: string;
    password: string;
    captcha: string;
    captchaId: number;
}
export type AuthF = {
    ok: boolean;
    error?: string;
    token?: string;
};
