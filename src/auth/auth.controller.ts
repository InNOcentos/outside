import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: 200 })
    @Post('/login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('/signin')
    signin(@Body() createUserDto: CreateUserDto) {
        return this.authService.login(createUserDto);
    }
}
