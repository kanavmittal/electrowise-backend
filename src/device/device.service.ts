import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
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
    try {
      var data = await this.DatabaseService.otp.findFirst({
        where: {
          otp: parseInt(Body.otp),
          device_id: {
            not: 0,
          },
          user_id: {
            not: 0,
          },
        },
      });
      if (!data) {
        return NotFoundException;
      }
      if (data.expiresAt < new Date()) {
        return NotAcceptableException;
      }
      var configuration = {
        user_id: data.user_id,
        device_id: data.device_id,
      };
      var token = jsonwebtoken.sign(
        configuration,
        process.env.JWT_DEVICE_SECRET,
      );
      await this.DatabaseService.device.update({
        where: {
          id: data.device_id,
        },
        data: {
          communication_url: token,
          status: true,
        },
      });
      return { token, configuration };
    } catch (error) {
      return InternalServerErrorException;
    }
  }

  async createDevice(body: createDeviceDto, req: any) {
    var data = await this.DatabaseService.device.create({
      data: {
        name: body.name,
        room_id: body.room_id,
        user_id: req.user.id,
      },
    });
    try {
      var otps = await this.DatabaseService.otp.findFirst({
        where: {
          device_id: 0,
          user_id: 0,
        },
      });
      await this.DatabaseService.otp.update({
        where: {
          id: otps.id,
        },
        data: {
          expiresAt: new Date(new Date().getMinutes() + 60000),
          device_id: data.id,
          user_id: req.user.id,
        },
      });
    } catch (error) {
      console.log(error);
      return InternalServerErrorException;
    }
    return { otp: `${otps.otp}` };
  }

  async deleteDevice(id: number, req: any) {
    var find = await this.DatabaseService.device.findFirst({
      where: {
        id: id,
        user_id: req.user.id,
      },
    });
    if (!find) {
      return NotAcceptableException;
    }
    await this.DatabaseService.device.delete({
      where: {
        id: id,
      },
    });
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
