import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CaptchaService } from '../captcha/captcha.service';
import { Public } from './decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService
  ) {}

  //@Public()
  //@HttpCode(HttpStatus.OK)
  //@Post('login')
  //signIn(@Body() signInDto: Record<string, any>) {
    //return this.authService.signIn(signInDto.username, signInDto.password);
  //}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('hello')
  getHello() {
    return 'Authorisation successful';
  }

  @Public()
  @Get('captcha')
  registrationRequest(@Res({ passthrough: true }) res: Response) {
    return this.captchaService.create()
  }

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: LoginUserDto): Promise<any> {
      const validCaptcha = await this.captchaService.checkCaptcha({
        id: registerUserDto.captchaId,
        value: registerUserDto.captcha
        })
      if (validCaptcha) {
        return this.authService.registerUser(registerUserDto);
      }
        throw new UnauthorizedException();
        //return res;
  }

  @Public()
  @Post('login')
  //login(@Body() loginUserDto: LoginUserDto): Promise<AuthF> {
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
      const validCaptcha = await this.captchaService.checkCaptcha({
        id: loginUserDto.captchaId,
        value: loginUserDto.captcha
        })
      if (validCaptcha) {
    return this.authService.signIn(loginUserDto);
      }
        throw new UnauthorizedException();
  }
}
