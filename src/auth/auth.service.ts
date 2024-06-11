import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SignupDto,
  SigninDto,
  ResetPasswordDto,
  ResetPasswordConfirmationDto,
  DeleteAccountDto,
} from './dto/authDto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    // ** Verifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // ** Comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Mot de passe incorrect');
    // ** Retourner un token jwt
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });

    return {
      token,
      user: {
        username: user.name,
        email: user.email,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    // ** Verifier si l'utilisateur existe déjà
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw new ConflictException("L'utilisateur existe déjà");
    // ** Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // ** Créer l'utilisateur
    await this.prisma.user.create({ data: { name, email, password: hash } });
    // ** Envoyer un mail de confirmation
    await this.mailer.sendSignupConfirmation(email);
    // ** Retourner une réponse de succès
    return {
      message: "L'utilisateur a été créé avec succès",
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    // ** Verifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Ustilisateur non trouve');
    // ** Générer un token de réinitialisation
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_SECRET'),
      digits: 4,
      step: 60 * 15,
      encoding: 'base32',
    });
    console.log(code);
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailer.sendResetPassword(email, url, code);
    return {
      data: "L'email de reinitialisation du mot de passe a ete bien envoye !",
    };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, code, password } = resetPasswordConfirmationDto;
    // ** Verifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur non trouve');
    // ** Verifier le code
    const valid = speakeasy.totp.verify({
      secret: this.configService.get('OTP_SECRET'),
      token: code,
      encoding: 'base32',
      step: 60 * 15,
      digits: 4,
    });

    if (!valid) throw new UnauthorizedException('Token invalide ou expire');

    const hash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hash },
    });

    return { data: 'Mot de passe reinitialise avec success' };
  }

  async deleteAccount(id: number, passDelete: DeleteAccountDto) {
    const { password } = passDelete;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur non trouve');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Mot de passe invalid');
    await this.prisma.user.delete({ where: { id } });
    return { data: 'Compte supprime avec success' };
  }
}
