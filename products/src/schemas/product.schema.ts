import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  totalProfit: number;

  @Prop()
  orderCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
