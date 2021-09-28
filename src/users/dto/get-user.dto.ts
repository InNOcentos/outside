export class GetUserDto {
    email: string;
    nickname: string;
    tags: {id: string, name: string, sortOrder: string}[]
}