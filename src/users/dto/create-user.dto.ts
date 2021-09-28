import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
    readonly email: string;
    @ApiProperty({ example: '123test', description: 'Пароль' })
    readonly password: string;
    @ApiProperty({ example: 'testname', description: 'Псевдоним' })
    readonly nickname: string;
}