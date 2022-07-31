import {
  Controller,
  Get,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as dayjs from 'dayjs';
import { NewOrderDto } from './dto/new-order.dto';
import { RpcValidationFilter } from './filter/rpcValidation.filter';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger(ProductsController.name);

  @EventPattern('new_order')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new RpcValidationFilter())
  handleNewOrder(@Payload() order: NewOrderDto) {
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
