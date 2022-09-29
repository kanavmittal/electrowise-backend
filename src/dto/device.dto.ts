import {
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  isString,
  IsString,
} from 'class-validator';

export class createDeviceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}

export class activateDeviceDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
export class activateDeviceDataDto {
  id: number;
  room_id: number;
  user_id: number;
}

export class setHeadDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class toggleClientData {
  device_url: string;
}
