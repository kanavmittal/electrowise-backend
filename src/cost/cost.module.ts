import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CostController } from './cost.controller';
import { CostService } from './cost.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CostController],
  providers: [CostService]
})
export class CostModule {}
