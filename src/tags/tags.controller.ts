import { Controller, Post, Body, Get, Query, Delete, Put, Param, Headers, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTagsQueryParamsDto } from './dto/get-tags-query-params.dto';
import { TagDto } from './dto/post-tag.dto';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@ApiTags('Тэги')
@Controller('tag')
export class TagsControllers {
    constructor (private tagsService: TagsService,
    ) { }

    @ApiOperation({ summary: 'Получение тэга' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getOne(@Req() request: any, @Param('id') tagId: string) {
        return this.tagsService.getTagById(request?.user?.uid, tagId);
    }

    @ApiOperation({ summary: 'Создание тэга' })
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200 })
    @Post('/')
    create(@Req() request: any, @Body() tagDto: TagDto) {
        return this.tagsService.createTag(request?.user?.uid, tagDto);
    }

    @ApiOperation({ summary: 'Получение списка тэгов' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Get('/')
    getMany(@Req() request: any, @Query() queryParams: GetTagsQueryParamsDto) {
        return this.tagsService.getTagsByUser(request?.user?.uid, queryParams);
    }

    @ApiOperation({ summary: 'Обновление тэгa' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    update(@Req() request: any, @Body() tagDto: TagDto, @Param('id') tagId: string) {
        return this.tagsService.updateTag(request?.user?.uid, tagDto, tagId);
    }

    @ApiOperation({ summary: 'Удаление тэгa' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    delete(@Req() request: any, @Param('id') tagId: string) {
        return this.tagsService.deleteTag(request?.user?.uid, tagId);
    }
}
