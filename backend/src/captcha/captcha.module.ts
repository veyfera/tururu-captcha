import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Captcha } from "./captcha.entity";
import { CaptchaService } from "./captcha.service";

@Module({
  imports: [TypeOrmModule.forFeature([Captcha])],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
