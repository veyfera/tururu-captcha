export class LoginUserDto {
  username: string;
  password: string;
  captcha: string;
  captchaId: number;
}

export type AuthToken = {
  access_token: string;
};
