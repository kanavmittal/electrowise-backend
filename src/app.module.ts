import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DeviceModule } from './device/device.module';
import { RoomsModule } from './rooms/rooms.module';
import { SharingModule } from './sharing/sharing.module';
import { CostModule } from './cost/cost.module';
import { GreenCoinService } from './green_coin/green_coin.service';
import { GreenCoinModule } from './green_coin/green_coin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
        serializers: {
          req: function customReqSerializer(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              user: req.user,
            };
          },
          res: function customResSerializer(res) {
            return {
              statusCode: res.statusCode,
              header: res.header,
              get user() {
                return res.raw.req.user;
              },
            };
          },
        },
      },
    }),
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    DeviceModule,
    RoomsModule,
    SharingModule,
    CostModule,
    GreenCoinModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, GreenCoinService],
})
export class AppModule {}
