import { Repository } from 'typeorm';
import { CaptchaDto, CheckCaptchaDto } from './dto/create-captcha.dto';
import { Captcha } from './captcha.entity';
export declare class CaptchaService {
    private readonly captchaRepository;
    constructor(captchaRepository: Repository<Captcha>);
    create(): Promise<CaptchaDto>;
    findAll(): Promise<Captcha[]>;
    findOne(id: number): Promise<Captcha>;
    checkCaptcha(checkCaptchaDto: CheckCaptchaDto): Promise<boolean>;
}
