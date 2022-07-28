import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import * as dayjs from 'dayjs';

import { ProductsService } from './products.service';
import { Order } from './schemas/order.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger(ProductsController.name);

  @EventPattern('new_order')
  handleNewOrder(order: Order) {
    return this.productsService.processOrder(order);
  }

  @Get('profitable')
  handleMostProfitable() {
    return this.productsService.findMostProfitable(10);
  }

  @Get('often_bought')
  handleMostOftenBouth() {
    return this.productsService.findMostOftenBought(10);
  }

  @Get('often_bought_yesterday')
  handleMostProfitableYesterday() {
    const yesterday = dayjs()
      .startOf('day')
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    return this.productsService.findMostProfitablePerDay(yesterday, 10);
  }
}
