import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './interface';
import { JWTUtil } from './jwt-utils';
import { hashPassword } from 'src/utils';

@Injectable()
export class AuthService {
    constructor (private userService: UsersService, private jwtService: JwtService, private jwtUtil: JWTUtil) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.validateUser(loginUserDto);
            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException('Неизвестная ошибка', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signin(createUserDto: CreateUserDto) {
        try {
            const userExistance = await this.userService.getUserByEmail(createUserDto?.email);
            if (userExistance) throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);

            const hash = await hashPassword(createUserDto?.password);
            const user = await this.userService.createUser({ ...createUserDto, password: hash });

            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException('Неизвестная ошибка', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refresh(body: any) {
        try {
            const { token } = body;
            if (!token) throw new HttpException('Неизвестная ошибка', HttpStatus.INTERNAL_SERVER_ERROR);

            const { uid } = this.jwtService.verify(token);
            const user = await this.userService.getUserById(uid);
            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException('Вы не имеете доступа для данной операции', HttpStatus.UNAUTHORIZED);
        }
    }

    private async generateTokens(user: User) {
        const accessToken = this.jwtService.sign(user, this.jwtUtil.getAccessTokenConfig());
        const refreshToken = this.jwtService.sign({ uid: user?.uid }, this.jwtUtil.getRefreshTokenConfig());

        return {
            accessToken,
            refreshToken
        };
    }

    private async validateUser(userDto: LoginUserDto): Promise<User> {
        const user: User = await this.userService.getUserByEmail(userDto?.email);
        if (!user) throw new HttpException('Некорректный email или пароль', HttpStatus.UNAUTHORIZED);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!(passwordEquals && user)) throw new UnauthorizedException('Некорректный email или пароль');

        return user;
    }
}
