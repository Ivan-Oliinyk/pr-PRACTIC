import { Controller, Get } from '@nestjs/common';
import { ShippoService } from './shippo.service';

@Controller('shippo')
export class ShippoController {
  constructor(private readonly shippo: ShippoService) {}

  @Get('/orders')
  async getOrders() {
    const orders = await this.shippo.getOrders();
    return orders;
  }
}
