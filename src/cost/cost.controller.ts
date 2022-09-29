import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CostService } from './cost.service';

@Controller('cost')
export class CostController {
    constructor(private CostService:CostService){}
    @UseGuards(AuthenticatedGuard)
    @Get('get')
    getCostByDate(@Request() req){
        return this.CostService.getCostByDate(req)
    }
}
