import { Controller, Post, Body, Get, Query, Delete, Put, Param, Headers } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { GetTagsQueryParamsDto } from './dto/get-tags-query-params.dto';
import { TagDto } from './dto/post-tag.dto';
import { TagsService } from './tags.service';
import { JWTUtil } from 'src/users/users.decorator';

@ApiTags('Тэги')
@Controller('auth')
export class TagsControllers {
    constructor (private tagsService: TagsService,
        private readonly jwtUtil: JWTUtil,
    ) {}

    @ApiOperation({ summary: 'Создание тэга' })
    @ApiResponse({ status: 200 })
    @Post('/tag')
    create(@Headers('authorization') auth: string, @Body() tagDto: TagDto) {
        const user = this.jwtUtil.decode(auth);
        return this.tagsService.createTag(user?.uid, tagDto);
    }

    @ApiOperation({ summary: 'Получение тэга' })
    @ApiResponse({ status: 200 })
    @Get('/tag:id')
    getOne(@Headers('authorization') auth: string, @Param('id') tagId: string) {
        const user = this.jwtUtil.decode(auth);
        return this.tagsService.getTagById(user?.uid, tagId);
    }

    @ApiOperation({ summary: 'Получение списка тэгов' })
    @ApiResponse({ status: 200 })
    @Get('/tag')
    getMany(@Headers('authorization') auth: string, @Query() queryParams: GetTagsQueryParamsDto) {
        const user = this.jwtUtil.decode(auth);
        return this.tagsService.getTagsByUser(user?.uid, queryParams);
    }

    @ApiOperation({ summary: 'Обновление тэгa' })
    @ApiResponse({ status: 200 })
    @Put('/tag:id')
    update(@Headers('authorization') auth: string, @Body() tagDto: TagDto, @Param('id') tagId: string) {
        const user = this.jwtUtil.decode(auth);
        return this.tagsService.updateTag(user?.uid, tagDto, tagId);
    }

    @ApiOperation({ summary: 'Удаление тэгa' })
    @ApiResponse({ status: 200 })
    @Delete('/tag:id')
    delete(@Headers('authorization') auth: string, @Param('id') tagId: string) {
        const user = this.jwtUtil.decode(auth);
        return this.tagsService.deleteTag(user?.uid, tagId);
    }
}
