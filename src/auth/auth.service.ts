import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './interface';
import { JWTUtil } from './jwt-utils';
import { hashPassword } from 'src/utils';
import { HttpErrorValues } from 'src/constants';

@Injectable()
export class AuthService {
    constructor (private userService: UsersService, private jwtService: JwtService, private jwtUtil: JWTUtil) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.validateUser(loginUserDto);
            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues[e.message as HttpErrorValues] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signin(createUserDto: CreateUserDto) {
        try {
            if (!this.validatePassword(createUserDto?.password)) throw new HttpException(HttpErrorValues.invalid_password, HttpStatus.BAD_REQUEST)
            const userExistance = await this.userService.getUserByEmail(createUserDto?.email);
            if (userExistance) throw new HttpException(HttpErrorValues.user_already_exists, HttpStatus.BAD_REQUEST);

            const hash = await hashPassword(createUserDto?.password);
            const user = await this.userService.createUser({ ...createUserDto, password: hash });

            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues[e.message as HttpErrorValues] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refresh(body: any) {
        try {
            const { token } = body;

            const { uid } = this.jwtService.verify(token);
            const user = await this.userService.getUserById(uid);
            return this.generateTokens(user);
        } catch (e) {
            console.log(e);
            throw new HttpException(HttpErrorValues[e.message as HttpErrorValues] || HttpErrorValues.unknown, e?.status || HttpStatus.INTERNAL_SERVER_ERROR);
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
        if (!user) throw new HttpException(HttpErrorValues.invalid_email_or_password, HttpStatus.UNAUTHORIZED);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!(passwordEquals && user)) throw new UnauthorizedException(HttpErrorValues.invalid_email_or_password);

        return user;
    }

    private validatePassword(password: string) {
        const hasUpperCaseLoweCaseAndNumber = password.match(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/)
        const isValidLength = password.match(/^\w{5,}$/)
        return (hasUpperCaseLoweCaseAndNumber && isValidLength)
    }
}
