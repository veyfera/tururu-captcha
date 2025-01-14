import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginUserDto, AuthToken } from "./dto/login-user.dto";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    registerUser(registerUserDto: LoginUserDto): Promise<BadRequestException | AuthToken>;
}
