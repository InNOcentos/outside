import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
    @ApiProperty({example: 'test', description: 'Рефреш токен'})
    token: string
}