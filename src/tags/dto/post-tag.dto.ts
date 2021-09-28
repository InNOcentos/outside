import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
    @ApiProperty({ example: 'name', description: 'Название тега' })
    name: string;

    @ApiProperty({ example: '0', description: 'Порядок сортировки' })
    sortOrder?: string;
}
