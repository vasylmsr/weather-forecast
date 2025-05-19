import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

// Database
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './db/typeorm';

// Application Modules
import { WeatherModule } from './modules/weather/weather.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { WeatherMailingScheduleModule } from './modules/cron/weather-mailing-schedule/weather-mailing-schedule.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return typeOrmConfig();
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailModule,
    WeatherModule,
    SubscriptionModule,
    WeatherMailingScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
