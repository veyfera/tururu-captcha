
export class CreateUserDto {
  firstName: string;
  lastName: string;
}

export class LoginUserDto{
  firstName: string;
  lastName: string;
}

export type AuthF = {
ok: boolean;
error?: string;
token?: string;
}
