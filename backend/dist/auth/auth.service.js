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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcryptjs_1 = require("bcryptjs");
const SALT_ROUNNDS = 10;
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginUserDto) {
        const user = await this.usersService.findByUsername(loginUserDto.username);
        console.log("found user: ", user);
        if (!user || !(0, bcryptjs_1.compareSync)(loginUserDto.password, user?.password)) {
            console.log("password does not match");
            throw new common_1.UnauthorizedException("Wrong username or password");
        }
        const payload = { username: user.username, sub: user.id };
        console.log("sendign jwt token");
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async registerUser(registerUserDto) {
        const validEmail = registerUserDto.username.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!validEmail) {
            console.log("Email format is invalid");
            throw new common_1.BadRequestException("Email format is invalid");
        }
        const userExists = await this.usersService.findByUsername(registerUserDto.username);
        if (userExists) {
            console.log("This email is already registered. Please choose another one");
            throw new common_1.BadRequestException("This email is already registered. Please choose another one");
        }
        const validPassword = registerUserDto.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/);
        if (!validPassword) {
            console.log("Password must be at least 8 characters long contain a number and an uppercase letter");
            throw new common_1.BadRequestException("Password must be at least 8 characters long contain a number and an uppercase letter");
        }
        registerUserDto.password = (0, bcryptjs_1.hashSync)(registerUserDto.password, SALT_ROUNNDS);
        const user = await this.usersService.create(registerUserDto);
        console.log("succesfuly created new user");
        const payload = { username: user.username, sub: user.id };
        console.log("sendign jwt token");
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map