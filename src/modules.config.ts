import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async () => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '24h',
    },
  }),
  inject: [ConfigService],
});
