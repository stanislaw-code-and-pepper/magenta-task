import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewOrderDto } from './dto/new-order.dto';
import { Product } from './schemas/product.schema';
import { ProductDocument } from './schemas/product.schema';

const COMMON_FIELDS = 'id -_id name price totalProfit orderCount';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  findMostProfitable(limit: number) {
    return this.productModel
      .find({}, COMMON_FIELDS)
      .sort({ totalProfit: -1 })
      .limit(limit)
      .exec();
  }

  findMostOftenBought(limit: number) {
    return this.productModel
      .find({}, COMMON_FIELDS)
      .sort({ orderCount: -1 })
      .limit(limit)
      .exec();
  }

  findMostProfitablePerDay(date: string, limit: number) {
    return this.productModel
      .find({ [`orderCountPerDay.${date}`]: { $exists: true } })
      .sort({
        [`orderCountPerDay.${date}`]: -1,
      })
      .limit(limit)
      .select(COMMON_FIELDS)
      .exec();
  }

  async processOrder(order: NewOrderDto) {
    const orderDate = order.date.slice(0, 10);
    for (const item of order.items) {
      await this.productModel.findOneAndUpdate(
        { id: item.product.id },
        {
          $inc: {
            orderCount: 1,
            totalProfit: item.quantity * item.product.price,
            [`orderCountPerDay.${orderDate}`]: 1,
          },
          $setOnInsert: {
            ...item.product,
          },
        },
        {
          upsert: true,
        },
      );
      this.logger.debug(
        `Updating product ${item.product.name}(${item.product.id})`,
      );
    }
  }
}
