import { Controller, Post } from '@nestjs/common';
import { Body, Delete, UseGuards, Req } from '@nestjs/common/decorators';
import { SignupDto, SigninDto, ResetPasswordDto, ResetPasswordConfirmationDto, DeleteAccountDto } from './dto/authDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post("signup")
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post("signin")
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }

    @Post("reset-password")
    resetPasswordDemand(@Body() resetPasswordDto : ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post("reset-password-confirmation")
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteAccount(@Req() request : Request, @Body() deleteAccountDto : DeleteAccountDto) {
        const userId =  request.user["id"];
        return this.authService.deleteAccount(userId, deleteAccountDto);
    }
}
