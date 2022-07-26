import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { Order } from './schemas/order.schema';

@Controller()
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
          totalNumber: product.totalNumber + item.quantity,
        });
      } else {
        await this.productsService.create({
          ...item.product,
          totalNumber: item.quantity,
        });
      }
    });
  }
}
