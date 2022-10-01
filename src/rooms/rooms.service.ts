import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  Param,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createRoomDto } from 'src/dto';

@Injectable()
export class RoomsService {
  constructor(private DatabaseService: DatabaseService) {}
  async getRoom(req: any, id: number) {
    var data = await this.DatabaseService.room.findFirst({
      where: {
        id: id,
        user_id: req.user.id,
      },
    });
    return data;
  }
  async getRooms(req: any) {
    var data = await this.DatabaseService.room.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        devices: {
          include: {
            Device_data: {
              orderBy: {
                logged_at: 'desc',
              },
              take: 2,
            },
          },
        },
      },
    });
    for (var i = 0; i < data.length; i++) {
      var devices = data[i].devices;
      devices.sort(function (a, b) {
        var v1 = -10000000;
        var v2 = -10000000;
        if (a.Device_data.length > 0) {
          v1 = a.Device_data[0].power;
        }
        if (b.Device_data.length > 0) {
          v2 = b.Device_data[0].power;
        }
        return v2 - v1;
      });
      data[i].devices = devices;
    }
    return data;
  }
  async createRooms(body: createRoomDto, req: any) {
    console.log(body);
    try {
      var data = await this.DatabaseService.room.create({
        data: {
          name: body.name,
          user_id: req.user.id,
          description: body.description,
        },
      });
      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getRoomData(req: any, id: number) {
    var data = await this.DatabaseService
      .$queryRaw`SELECT time_bucket('1 hour', logged_at) AS BUCKET, SUM(power)/60 as avg_power, SUM(current)/60 as avg_current, avg(voltage) as avg_voltage FROM devicedata WHERE user_id=${req.user.id} AND room_id=${id} GROUP BY bucket ORDER BY bucket ASC;`;
    return data;
  }

  async getRoomDevices(req: any, id: number) {
    var data = await this.DatabaseService.room.findFirst({
      where: {
        id: id,
        user_id: req.user.id,
      },
      include: {
        devices: {
          select: {
            name: true,
          },
        },
      },
    });
    return data;
  }
  async deleteRoom(req: any, id: number) {
    var find = await this.DatabaseService.room.findFirst({
      where: {
        id: id,
        user_id: req.user.id,
      },
    });
    if (!find) {
      return NotAcceptableException;
    }
    await this.DatabaseService.room.delete({
      where: {
        id: id,
      },
    });
  }
}
