import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { postFollowDto } from 'src/dto';

@Injectable()
export class SharingService {
  constructor(private DatabaseService: DatabaseService) {}
  async searchUser(query: string) {
    var data = await this.DatabaseService.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return data;
  }

  async postFollow(request: postFollowDto) {
    await this.DatabaseService.followers.create({
      data: {
        user_id: request.follow_id,
        follower_id: request.user_id,
        isPending: true,
      },
    });
  }
  async getPendingRequests(req: any) {
    var data = await this.DatabaseService.followers.findMany({
      where: {
        user_id: req.user.id,
        isPending: true,
      },
    });
    var result = [];
    for (var i = 0; i < data.length; i++) {
      var followData = await this.DatabaseService.user.findFirst({
        where: {
          id: data[i].follower_id,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      result.push({ follower_data: followData, request: data[i] });
    }
    return result;
  }
  async acceptRequests(req: any) {
    var dataOb = await this.DatabaseService.followers.findFirst({
      where: {
        user_id: req.user.id,
        follower_id: req.follow_id,
        isPending: true,
      },
    });
    console.log(dataOb);
    await this.DatabaseService.followers.update({
      where: {
        id: dataOb.id,
      },
      data: {
        isPending: false,
      },
    });
    return dataOb;
  }
  async seeFollowers(req: any) {
    var data = await this.DatabaseService.followers.findMany({
      where: {
        user_id: req.user.id,
        isPending: false,
      },
    });

    var result = [];
    for (var i = 0; i < data.length; i++) {
      var followData = await this.DatabaseService.user.findFirst({
        where: {
          id: data[i].follower_id,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      result.push(followData);
    }
    return result;
  }
  async deleteReq(req: any) {
    var dataOb = await this.DatabaseService.followers.findFirst({
      where: {
        user_id: req.user.id,
        follower_id: req.follow_id,
        isPending: true,
      },
    });
    await this.DatabaseService.followers.delete({
      where: {
        id: dataOb.id,
      },
    });
    return dataOb;
  }
  async Following(req: any) {
    var data = await this.DatabaseService.followers.findMany({
      where: {
        follower_id: req.user.id,
        isPending: false,
      },
    });
    var result = [];
    for (var i = 0; i < data.length; i++) {
      var followData = await this.DatabaseService.user.findFirst({
        where: {
          id: data[i].user_id,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      result.push(followData);
    }
    return result;
  }

  async shareData(req: any, id: number) {
    var data = await this.DatabaseService.followers.findFirst({
      where: {
        follower_id: req.user.id,
        user_id: id,
        isPending: false,
      },
    });
    if (data) {
      var sharedData = await this.DatabaseService
        .$queryRaw`SELECT time_bucket('1 hour', logged_at) AS BUCKET, SUM(power)/60 as avg_power, SUM(current)/60 as avg_current, avg(voltage) as avg_voltage FROM devicedata WHERE user_id=${data.user_id} GROUP BY bucket ORDER BY bucket ASC;`;
      return sharedData;
    } else {
      throw new NotFoundException();
    }
  }
}
