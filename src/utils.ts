function addSqlParam(elem: string, idx: number, params: string[]): [number, string[]] {
    return [idx++, [...params, elem]];
}