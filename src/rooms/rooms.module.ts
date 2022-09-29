import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
    imports:[DatabaseModule],
  controllers: [RoomsController],
  providers: [RoomsService]

})
export class RoomsModule {}
