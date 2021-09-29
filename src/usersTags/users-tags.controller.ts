import { Put, Controller, Post, Get, UseGuards, Body, Delete, Headers, Req } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTagsIdsDto } from './dto/user-tags-ids.dto';
import { UsersTagsService } from './users-tags.service';

@ApiTags('Пользователи-Теги')
@Controller('user/tag')
export class UsersTagsController {
    constructor (private usersTagsService: UsersTagsService) { }

    @ApiOperation({ summary: 'Создание тега по его id' })
    @Post('/')
    @ApiResponse({ status: 201 })
    @UseGuards(JwtAuthGuard)
    create(@Req() request: any, @Body() userTagsIdsDto: UserTagsIdsDto) {
        return this.usersTagsService.createTagsByIds(request?.user?.uid, userTagsIdsDto);
    }
}
