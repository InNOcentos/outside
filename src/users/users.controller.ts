import { Put, Controller, Post, Get, UseGuards, Body, Delete, Headers } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';
import { JWTUtil } from './users.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor (private authService: AuthService, private usersService: UsersService, private readonly jwtUtil: JWTUtil) {}

    @ApiOperation({ summary: 'Получение пользователя' })
    @Get('/user')
    @UseGuards(JwtAuthGuard)
    getUser(@Headers('authorization') auth: string) {
        const user = this.jwtUtil.decode(auth);
        return this.usersService.getUserById(user?.uid);
    }

    @ApiOperation({ summary: 'Обновление пользователя' })
    @Put('/user')
    @UseGuards(JwtAuthGuard)
    updateUser(@Headers('authorization') auth: string, @Body() newUserData: CreateUserDto) {
        const user = this.jwtUtil.decode(auth);
        return this.usersService.updateUserById(user?.uid, newUserData);
    }

    @ApiOperation({ summary: 'Удаление пользователя' })
    @Delete('/user')
    @UseGuards(JwtAuthGuard)
    deleteUser(@Headers('authorization') auth: string) {
        const user = this.jwtUtil.decode(auth);
        return this.usersService.deleteUserById(user?.uid);
    }
}
