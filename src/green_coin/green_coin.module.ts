import { Module } from '@nestjs/common';
import { GreenCoinService } from './green_coin.service';
import { GreenCoinController } from './green_coin.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GreenCoinService],
  controllers: [GreenCoinController],
})
export class GreenCoinModule {}
