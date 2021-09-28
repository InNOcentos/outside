import * as bcrypt from 'bcryptjs';

export function addSqlParam(elem: string, idx: number, params: string[]): [number, string[]] {
    return [idx + 1, [...params, elem]];
}
export async function hashPassword(password: string) {
    return await bcrypt.hash(String(password), 5);
}