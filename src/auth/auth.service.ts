import { HttpException, HttpStatus, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userService.getUser(loginUserDto);
        if (!user) throw new UnauthorizedException('Некорректный email или пароль');
        return user;
    }

    async signin(createUserDto: CreateUserDto) {
        const { email } = createUserDto;
        const userExistance = await this.userService.getUsersByEmail(email);
        console.log(userExistance);
        if (userExistance) throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        const newUser = await this.userService.createUser(createUserDto);
        return newUser;
    }
}
