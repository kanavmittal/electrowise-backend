import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { min } from 'class-validator';
import { now } from 'moment';
import { DatabaseService } from 'src/database/database.service';
import { user } from 'src/dto';

@Injectable()
export class GreenCoinService {
  constructor(private DatabaseService: DatabaseService) {}
  //   private readonly logger = new Logger(GreenCoinService.name);
  @Cron('0 30 11 * * 1-6')
  async handleCron() {
    var users = await this.DatabaseService.user.findMany({});
    var maxCoins = 100;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var data = (await this.DatabaseService
        .$queryRaw`SELECT time_bucket('1 day', logged_at) AS BUCKET, SUM(power)/60 as avg_power, SUM(current)/60 as avg_current, avg(voltage) as avg_voltage FROM devicedata WHERE user_id=${user.id} GROUP BY bucket ORDER BY bucket DESC LIMIT 2;`) as Array<user>;
      if (data.length > 1) {
        if (data[0].avg_power > data[1].avg_power && user.green_coins > 0) {
          const updateUser = await this.DatabaseService.user.update({
            where: {
              id: user.id,
            },
            data: {
              green_coins: user.green_coins - (30 / 100) * 100,
            },
          });
          console.log(updateUser);
        } else {
          const updateUser = await this.DatabaseService.user.update({
            where: {
              id: user.id,
            },
            data: {
              green_coins:
                user.green_coins +
                Math.min(
                  maxCoins,
                  (data[0].avg_power / data[1].avg_power) * 100,
                ),
            },
          });
          console.log(updateUser);
        }
      }
    }
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  // @Cron('* * * * * *')
  // async handleeCron() {
  //   var users = await this.DatabaseService.user.findMany({});
  //   var userID = this.getRandomInt(0, users.length);
  //   var user = users[userID];

  //   var devices = await this.DatabaseService.device.findMany({
  //     where: {
  //       id: user.id,
  //     },
  //   });

  //   var room = await this.DatabaseService.room.findMany({
  //     where: {
  //       id: user.id,
  //     },
  //   });

  //   var randomDevice = devices[this.getRandomInt(0, devices.length)].id;
  //   var randomRoom = room[this.getRandomInt(0, room.length)].id;
  //   await this.DatabaseService.devicedata.create({
  //     data: {
  //       logged_at: new Date(),
  //       power: this.getRandomInt(1, 5000),
  //       current: this.getRandomInt(1, 20),
  //       voltage: 240,
  //       frequency: 50,
  //       device_id: randomDevice,
  //       user_id: user.id,
  //       room_id: randomRoom,
  //       power_factor: 1,
  //     },
  //   });
  // }
  //   0 30 11 * * 1-6
}
