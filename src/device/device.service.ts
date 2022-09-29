import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  activateDeviceDataDto,
  activateDeviceDto,
  createDeviceDto,
  setHeadDeviceDto,
} from 'src/dto';

import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const algorithm = 'aes-256-cbc';
@Injectable()
export class DeviceService {
  constructor(private DatabaseService: DatabaseService) {}
  async listDevices(req: any) {
    var data = await this.DatabaseService.device.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    });
    return data;
  }
  async oneDevice(req: any, id: number) {
    var data = await this.DatabaseService.device.findFirst({
      where: {
        id: id,
        user_id: req.user.id,
      },
    });
    return data;
  }

  async getEncryptedDeviceInternal(id: string) {
    var data = await this.DatabaseService.device.findFirst({
      where: {
        communication_url: id,
      },
    });
    // TODO : add encryption
    return data;
  }

  async activateDevice(Body: activateDeviceDto) {
    // var deviceData = this.jwtService.decode(
    //   Body.token,
    // ) as activateDeviceDataDto;
    try {
      var data = await this.DatabaseService.otp.findFirst({
        where: {
          otp: parseInt(Body.otp),
          device_id: {
            not: 0,
          },
        },
      });
      if (!data && data.expiresAt < new Date()) {
        return NotFoundException;
      }
    } catch (error) {
      return InternalServerErrorException;
    }

    // var secret = uuidv4();
    // await this.DatabaseService.device.update({
    //   where: {
    //     id: deviceData.id,
    //   },
    //   data: {
    //     communication_url: url,
    //     status: true,
    //     secret: secret,
    //   },
    // });
    // return { url, secret };
  }
  async createDevice(body: createDeviceDto, req: any) {
    var data = await this.DatabaseService.device.create({
      data: {
        name: body.name,
        room_id: body.room_id,
        user_id: req.user.id,
      },
    });

    console.log(data);
    try {
      var otps = await this.DatabaseService.otp.findFirst({
        where: {
          device_id: 0,
        },
      });
      await this.DatabaseService.otp.update({
        where: {
          id: otps.id,
        },
        data: {
          expiresAt: new Date(new Date().getMinutes() + 60000),
          device_id: data.id,
        },
      });
    } catch (error) {
      console.log(error);
      return InternalServerErrorException;
    }
    return { otp: `${otps.otp}` };
  }

  async deleteDevice(id: number) {
    const deleteData = this.DatabaseService.devicedata.deleteMany({
      where: {
        device_id: id,
      },
    });
    const deleteDevice = this.DatabaseService.device.delete({
      where: {
        id: id,
      },
    });
    var result = await this.DatabaseService.$transaction([
      deleteData,
      deleteDevice,
    ]);
    return result;
  }
  async deviceData(req: any, id: number) {
    var sharedData = await this.DatabaseService
      .$queryRaw`SELECT time_bucket('1 hour', logged_at) AS BUCKET, SUM(power)/60 as avg_power, SUM(current)/60 as avg_current, avg(voltage) as avg_voltage FROM devicedata WHERE user_id=${req.user.id} AND device_id=${id} GROUP BY bucket ORDER BY bucket ASC;`;
    // var data=await this.DatabaseService.device.findFirst({
    //     where:{
    //         id: id,
    //         user_id:req.user.id,
    //     },
    //     include:{
    //         Device_data:{
    //             where:{
    //                 logged_at:{
    //                     gte:new Date('2022-06-17 21:00:46.085')
    //                 }
    //             },
    //             select:{
    //                 logged_at:true,
    //                 power:true,
    //                 voltage:true,
    //                 current:true,
    //             }
    //         }
    //     }
    // })
    return sharedData;
  }
  async getAllData(req) {
    var sharedData = await this.DatabaseService
      .$queryRaw`SELECT time_bucket('1 hour', logged_at) AS BUCKET, SUM(power)/60 as avg_power, SUM(current)/60 as avg_current, avg(voltage) as avg_voltage FROM devicedata WHERE user_id=${req.user.id} GROUP BY bucket ORDER BY bucket ASC;`;
    return sharedData;
  }

  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
}
