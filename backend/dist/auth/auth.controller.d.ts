import { UnauthorizedException, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CaptchaService } from "../captcha/captcha.service";
import { LoginUserDto, AuthToken } from "./dto/login-user.dto";
export declare class AuthController {
    private authService;
    private captchaService;
    constructor(authService: AuthService, captchaService: CaptchaService);
    getHello(): string;
    registrationRequest(res: Response): Promise<import("../captcha/dto/create-captcha.dto").CaptchaDto>;
    register(registerUserDto: LoginUserDto): Promise<BadRequestException | AuthToken>;
    login(loginUserDto: LoginUserDto): Promise<UnauthorizedException | AuthToken>;
}
