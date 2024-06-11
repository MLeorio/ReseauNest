import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString({ message: 'Doit etre une chaine de caractere' })
  @IsNotEmpty({ message: 'Ne peut pas etre vide' })
  readonly content: string;
}
