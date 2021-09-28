import { Put, Controller, Post, Get, UseGuards, Body, Delete, Headers, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';
import { JWTUtil } from 'src/auth/jwt-utils';

@ApiTags('Пользователи')
@Controller('user')
export class UsersController {
    constructor (private authService: AuthService, private usersService: UsersService, private readonly jwtUtil: JWTUtil) { }

    @ApiOperation({ summary: 'Получение пользователя' })
    @Get('/')
    @UseGuards(JwtAuthGuard)
    getUser(@Req() request: any) {
        return this.usersService.getUserById(request?.user?.uid);
    }

    @ApiOperation({ summary: 'Обновление пользователя' })
    @Put('/')
    @UseGuards(JwtAuthGuard)
    updateUser(@Req() request: any, @Body() newUserData: CreateUserDto) {
        return this.usersService.updateUserById(request?.user?.uid, newUserData);
    }

    @ApiOperation({ summary: 'Удаление пользователя' })
    @Delete('/')
    @UseGuards(JwtAuthGuard)
    deleteUser(@Req() request: any) {
        return this.usersService.deleteUserById(request?.user?.uid);
    }
}
