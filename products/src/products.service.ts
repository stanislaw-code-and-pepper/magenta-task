import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  findById(id: string) {
    return this.productModel.findOne({ id }).exec();
  }

  create(product: Product) {
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  update(id: string, product: Partial<Omit<Product, 'id'>>) {
    return this.productModel.findOneAndUpdate({ id }, product);
  }

  findMostProfitable(limit: number) {
    return this.productModel
      .find()
      .sort({ totalProfit: -1 })
      .limit(limit)
      .exec();
  }

  findMostOftenBought(limit: number) {
    return this.productModel
      .find()
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
      .exec();
  }
}
