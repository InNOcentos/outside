import { ApiProperty } from '@nestjs/swagger';

export class UserTagsIdsDto {
    @ApiProperty({ example: [1, 2], description: 'Список тегов' })
    tags: number[]
}