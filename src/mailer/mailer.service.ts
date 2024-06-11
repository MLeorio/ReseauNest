import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transporter;
  }
  async sendSignupConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Signed Up',
      html: "<h3>Confirmation d'inscription</h3>",
    });
  }

  async sendResetPassword(userEmail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Reset Password',
      html: `
        <h3>Reinitialiser le mot de passe</h3>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Voici le lien pour réinitialiser votre mot de passe : <a href="${url}">${url}</a></p>
        <p>Code de vérification : ${code}</p>
        <p>Ce code expire dans 15 minutes<p>
      `,
    });
  }
}
