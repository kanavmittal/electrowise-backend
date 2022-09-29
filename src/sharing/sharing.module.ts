import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SharingController } from './sharing.controller';
import { SharingService } from './sharing.service';

@Module({
  imports:[DatabaseModule],
  controllers: [SharingController],
  providers: [SharingService]
  
})
export class SharingModule {}
