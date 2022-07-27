import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { Order } from './schemas/order.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger(ProductsController.name);

  @EventPattern('new_order')
  async handleNewOrder(order: Order) {
    this.logger.debug(order.items);

    order.items.forEach(async (item) => {
      const product = await this.productsService.findById(item.product.id);
      if (product) {
        await this.productsService.update(product.id, {
          totalProfit: product.totalProfit + item.quantity * item.product.price,
          orderCount: product.orderCount + 1,
        });
      } else {
        await this.productsService.create({
          ...item.product,
          totalProfit: item.quantity * item.product.price,
          orderCount: 1,
        });
      }
    });
  }

  @Get('profitable')
  handleMostProfitable() {
    return this.productsService.findMostProfitable(10);
  }

  @Get('often_bought')
  handleMostOftenBouth() {
    return this.productsService.findMostOftenBought(10);
  }
}
