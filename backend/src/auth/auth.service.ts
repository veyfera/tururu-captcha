import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

import { LoginUserDto, AuthToken } from "./dto/login-user.dto";

import { compareSync, hashSync } from "bcryptjs";
const SALT_ROUNNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByUsername(loginUserDto.username);
    console.log("found user: ", user);
    if (!user || !compareSync(loginUserDto.password, user?.password)) {
      console.log("password does not match");
      throw new UnauthorizedException("Wrong username or password");
    }
    const payload = { username: user.username, sub: user.id };
    console.log("sendign jwt token");
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerUser(
    registerUserDto: LoginUserDto,
  ): Promise<BadRequestException | AuthToken> {
    const validEmail = registerUserDto.username.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (!validEmail) {
      console.log("Email format is invalid");
      throw new BadRequestException("Email format is invalid");
    }

    const userExists = await this.usersService.findByUsername(
      registerUserDto.username,
    );
    if (userExists) {
      console.log(
        "This email is already registered. Please choose another one",
      );
      throw new BadRequestException(
        "This email is already registered. Please choose another one",
      );
    }

    const validPassword = registerUserDto.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
    );
    if (!validPassword) {
      console.log(
        "Password must be at least 8 characters long contain a number and an uppercase letter",
      );
      throw new BadRequestException(
        "Password must be at least 8 characters long contain a number and an uppercase letter",
      );
    }

    registerUserDto.password = hashSync(registerUserDto.password, SALT_ROUNNDS);
    const user = await this.usersService.create(registerUserDto);

    console.log("succesfuly created new user");
    const payload = { username: user.username, sub: user.id };
    console.log("sendign jwt token");
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
