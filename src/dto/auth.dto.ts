import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Socket } from 'socket.io';

export class authLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class authRegisterDto {
  @IsString()
  @Length(4)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 32)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  cost: number;

  phone_number: string;
}
export class user {
  avg_power: number;
}

export type TokenPayload = {
  username: string;
  sub: number;
  type: string;
};
export type SocketWithAuth = Socket & TokenPayload;
