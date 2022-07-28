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
  async handleNewOrder(order: Order) {
    const orderDate = order.date.slice(0, 10);
    for (const item of order.items) {
      const product = await this.productsService.findById(item.product.id);
      if (product) {
        await this.productsService.update(product.id, {
          totalProfit: product.totalProfit + item.quantity * item.product.price,
          orderCount: product.orderCount + 1,
          orderCountPerDay: {
            ...product.orderCountPerDay,
            [orderDate]: (product.orderCountPerDay[orderDate] || 0) + 1,
          },
        });
        this.logger.debug(
          `Product ${item.product.name}(${item.product.id}) updated`,
        );
      } else {
        await this.productsService.create({
          ...item.product,
          totalProfit: item.quantity * item.product.price,
          orderCount: 1,
          orderCountPerDay: {
            [orderDate]: 1,
          },
        });
        this.logger.debug(
          `Product ${item.product.name}(${item.product.id}) created`,
        );
      }
    }
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
