import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 2525,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: '"Weather Forecast App" <noreply@my-test-app.com>',
          },
          template: {
            dir: path.join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: false },
          },
        };
      },
    }),
  ],
})
export class MailModule {}
