export declare class CreateUserDto {
    firstName: string;
    lastName: string;
}
export declare class LoginUserDto {
    firstName: string;
    lastName: string;
}
export type AuthF = {
    ok: boolean;
    error?: string;
    token?: string;
};
