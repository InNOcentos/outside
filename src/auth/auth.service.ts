import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './interface';
import { JWTUtil } from './jwt-utils';

@Injectable()
export class AuthService {
    constructor (private userService: UsersService, private jwtService: JwtService, private jwtUtil: JWTUtil) { }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto);
        return this.generateTokens(user);
    }

    async signin(createUserDto: CreateUserDto) {
        const userExistance = await this.userService.getUserByEmail(createUserDto?.email);
        if (userExistance) throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);

        const hashPassword = await bcrypt.hash(String(createUserDto.password), 5);
        const user = await this.userService.createUser({ ...createUserDto, password: hashPassword });

        return this.generateTokens(user);
    }

    private async generateTokens(user: User) {
        const accessToken = this.jwtService.sign(user, this.jwtUtil.getAccessTokenConfig())
        const refreshToken = this.jwtService.sign(user, this.jwtUtil.getRefreshTokenConfig())

        return {
            accessToken,
            refreshToken
        };
    }

    private async validateUser(userDto: LoginUserDto): Promise<User> {
        const user: User = await this.userService.getUserByEmail(userDto?.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!(passwordEquals && user)) throw new UnauthorizedException('Некорректный email или пароль');

        return user;
    }
}
