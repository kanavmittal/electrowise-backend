import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DeviceController } from './device.controller';
import { DeviceGateway } from './device.gateway';
import { DeviceService } from './device.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceGateway],
})
export class DeviceModule {}
