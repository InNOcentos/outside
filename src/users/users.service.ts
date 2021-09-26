import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
    constructor(@Inject(PG_CONNECTION) private readonly pool: any) {}

    async createUser(createUserDto: CreateUserDto) {
        const { email, password, nickname } = createUserDto;
        let sql = 'INSERT INTO outside.user (email, password, nickname) VALUES ($1, $2, $3) RETURNING *';
        const user = (await this.pool.query(sql, [email, password, nickname]))?.rows[0];
        return user;
    }

    async getUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        console.log(email, password);
        let sql = 'SELECT * FROM outside.user ou WHERE email = $1 AND password = $2';
        const user = (await this.pool.query(sql, [email, password]))?.rows[0];
        return user;
    }

    async getUsersByEmail(email: string) {
        let sql = 'SELECT * FROM outside.user ou WHERE email = $1';
        const user = (await this.pool.query(sql, [email]))?.rows[0];
        return user;
    }
}