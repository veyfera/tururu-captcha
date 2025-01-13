export declare class CaptchaDto {
    id: number;
    img: string;
}
export declare class CheckCaptchaDto {
    id: number;
    value: string;
}
export type AuthF = {
    ok: boolean;
    error?: string;
    token?: string;
};
