import { AuthService } from './auth.service';
import { CaptchaService } from '../captcha/captcha.service';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    private captchaService;
    constructor(authService: AuthService, captchaService: CaptchaService);
    getProfile(req: any): any;
    getHello(): string;
    registrationRequest(res: Response): Promise<import("../captcha/dto/create-captcha.dto").CaptchaDto>;
    register(registerUserDto: LoginUserDto): Promise<any>;
    login(loginUserDto: LoginUserDto): Promise<any>;
}
