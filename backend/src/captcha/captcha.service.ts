import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Raw } from "typeorm";
import { CaptchaDto, CheckCaptchaDto } from "./dto/create-captcha.dto";
import { Captcha } from "./captcha.entity";

import { default as CaptchaGen } from "captcha-generator-alphanumeric";

const CAPTCHA_TIMEOUT = 5; //minutes

@Injectable()
export class CaptchaService {
  constructor(
    @InjectRepository(Captcha)
    private readonly captchaRepository: Repository<Captcha>,
  ) {}

  async create(): Promise<CaptchaDto> {
    const captchaImg = new CaptchaGen();
    const dataUrl = captchaImg.dataURL;
    console.log(captchaImg.value);

    const captcha = new Captcha();
    captcha.value = captchaImg.value;
    const { id } = await this.captchaRepository.save(captcha);
    return { id: id, img: dataUrl };
  }

  async findAll(): Promise<Captcha[]> {
    return this.captchaRepository.find();
  }

  findOne(id: number): Promise<Captcha> {
    return this.captchaRepository.findOneBy({ id: id });
  }

  async checkCaptcha(checkCaptchaDto: CheckCaptchaDto): Promise<boolean> {
    console.log(checkCaptchaDto);
    if (!checkCaptchaDto.id) {
        return false
    }
    const captcha = await this.captchaRepository.findOne({
      where: {
        id: checkCaptchaDto.id,
        timestamp: Raw(
          (alias) =>
            `${alias} >= CURRENT_TIMESTAMP - interval ${CAPTCHA_TIMEOUT} minute`,
        ),
      },
    });
    if (captcha && captcha.value === checkCaptchaDto.value.toUpperCase()) {
      console.log("Captcha OK: ", captcha);
      this.captchaRepository.delete(checkCaptchaDto.id);
      return true;
    }
    console.log("Captcha failed: ", captcha);
    this.captchaRepository.delete(checkCaptchaDto.id);
    return false;
  }
}
