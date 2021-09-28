import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
    readonly email: string;
    @ApiProperty({ example: 'test123', description: 'Пароль' })
    readonly password: string;
}