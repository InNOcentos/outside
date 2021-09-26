import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './constants';

@Injectable()
export class AppService {
    constructor(@Inject(PG_CONNECTION) private readonly conn: any) {}

    async getHello(): Promise<any> {
        const res = await this.conn.query('SELECT * FROM outside.user');
        return res?.rows;
    }
}
