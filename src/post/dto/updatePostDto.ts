import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title? : string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly body? : string;
}
