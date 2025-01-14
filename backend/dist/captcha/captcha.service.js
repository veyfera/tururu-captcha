"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const captcha_entity_1 = require("./captcha.entity");
const captcha_generator_alphanumeric_1 = require("captcha-generator-alphanumeric");
const CAPTCHA_TIMEOUT = 5;
let CaptchaService = class CaptchaService {
    constructor(captchaRepository) {
        this.captchaRepository = captchaRepository;
    }
    async create() {
        const captchaImg = new captcha_generator_alphanumeric_1.default();
        const dataUrl = captchaImg.dataURL;
        console.log(captchaImg.value);
        const captcha = new captcha_entity_1.Captcha();
        captcha.value = captchaImg.value;
        const { id } = await this.captchaRepository.save(captcha);
        return { id: id, img: dataUrl };
    }
    async findAll() {
        return this.captchaRepository.find();
    }
    findOne(id) {
        return this.captchaRepository.findOneBy({ id: id });
    }
    async checkCaptcha(checkCaptchaDto) {
        console.log(checkCaptchaDto);
        if (!checkCaptchaDto.id) {
            return false;
        }
        const captcha = await this.captchaRepository.findOne({
            where: {
                id: checkCaptchaDto.id,
                timestamp: (0, typeorm_2.Raw)((alias) => `${alias} >= CURRENT_TIMESTAMP - interval ${CAPTCHA_TIMEOUT} minute`),
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
};
exports.CaptchaService = CaptchaService;
exports.CaptchaService = CaptchaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(captcha_entity_1.Captcha)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CaptchaService);
//# sourceMappingURL=captcha.service.js.map