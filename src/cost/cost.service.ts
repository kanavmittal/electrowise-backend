import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as moment from 'moment';
require('twix');
@Injectable()
export class CostService {
  constructor(private DatabaseService: DatabaseService) {}
  async getCostByDate(req: any) {
    {
      userIsRegistredOn: moment();
    }
    var cost = await this.DatabaseService.user.findFirst({
      where: {
        id: req.user.id,
      },
      select: {
        electricty_cost: true,
      },
    });

    var data = (await this.DatabaseService
      .$queryRaw`SELECT time_bucket('1 day', logged_at) AS BUCKET, SUM(power)/60 as avg_power FROM devicedata WHERE user_id=${req.user.id} GROUP BY bucket ORDER BY bucket ASC;`) as [
      { bucket: string; avg_power: number },
    ];
    var result = [];
    for (var i = 0; i < data.length; i++) {
      result.push({
        eventStart: new Date(data[i].bucket),
        eventName: 'Cost',
        eventData: data[i].avg_power,
        eventColor: 'emerald',
      });
    }
    return result;
  }
}
