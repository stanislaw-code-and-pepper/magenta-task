import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @EventPattern('new_order')
  handleNewOrder(data: any) {
    this.productsService.processOrder(data);
  }
}
