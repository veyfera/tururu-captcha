import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    registerUser(registerUserDto: LoginUserDto): Promise<any>;
}
