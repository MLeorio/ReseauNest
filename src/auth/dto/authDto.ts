import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}

export class SigninDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email : string
}

export class ResetPasswordConfirmationDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email : string;

    @IsString()
    @IsNotEmpty()
    readonly password : string;

    @IsString()
    @IsNotEmpty()
    readonly code : string
}

export class DeleteAccountDto {
    @IsNotEmpty()
    @IsString()
    readonly password : string;
}