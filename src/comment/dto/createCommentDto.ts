import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    readonly content : string

    @IsNotEmpty()
    readonly postId : number
}