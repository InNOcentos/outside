import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './interface';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto);
        return this.generateToken(user);
    }

    async signin(createUserDto: CreateUserDto) {
        const userExistance = await this.userService.getUserByEmail(createUserDto?.email);
        if (userExistance) throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);

        const hashPassword = await bcrypt.hash(String(createUserDto.password), 5);
        const user = await this.userService.createUser({ ...createUserDto, password: hashPassword });

        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, nickname: user.nickname, uid: user.uid };

        return {
            token: this.jwtService.sign(payload),
            //TODO: fix
            expire: '1800'
        };
    }

    private async validateUser(userDto: LoginUserDto): Promise<User> {
        const user: User = await this.userService.getUserByEmail(userDto?.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!(passwordEquals && user)) throw new UnauthorizedException('Некорректный email или пароль');

        return user;
    }
}
