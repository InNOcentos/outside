import { Controller, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Авторизация')
@Controller('/')
export class AuthController {
    constructor (private authService: AuthService) { }

    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: 200 })
    @Post('/login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @ApiOperation({ summary: 'Регистрация' })
    @ApiResponse({ status: 200 })
    @Post('/signin')
    signin(@Body() createUserDto: CreateUserDto) {
        return this.authService.signin(createUserDto);
    }

    @ApiOperation({ summary: 'Обновление токена' })
    @ApiResponse({ status: 200 })
    @Post('/refresh')
    refresh(@Body() refreshToken: RefreshTokenDto) {
        return this.authService.refresh(refreshToken);
    }
}
