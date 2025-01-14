import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CaptchaService } from "../captcha/captcha.service";
import { Public } from "./decorators/public.decorator";
import { LoginUserDto, AuthToken } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Get("hello")
  getHello() {
    return "Authorisation successful";
  }

  @Public()
  @Get("captcha")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registrationRequest(@Res({ passthrough: true }) res: Response) {
    return this.captchaService.create();
  }

  @Public()
  @Post("register")
  async register(
    @Body() registerUserDto: LoginUserDto,
  ): Promise<BadRequestException | AuthToken> {
    const validCaptcha = await this.captchaService.checkCaptcha({
      id: registerUserDto.captchaId,
      value: registerUserDto.captcha,
    });
    if (validCaptcha) {
      return this.authService.registerUser(registerUserDto);
    }
    throw new UnauthorizedException("Captcha verification failed");
  }

  @Public()
  @Post("login")
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UnauthorizedException | AuthToken> {
    const validCaptcha = await this.captchaService.checkCaptcha({
      id: loginUserDto.captchaId,
      value: loginUserDto.captcha,
    });
    if (validCaptcha) {
      return this.authService.login(loginUserDto);
    }
    throw new UnauthorizedException("Captcha verification failed");
  }
}
