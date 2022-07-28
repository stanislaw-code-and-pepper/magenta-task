import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ unique: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  totalProfit: number;

  @Prop()
  orderCount: number;

  @Prop({ type: Types.Map })
  orderCountPerDay: Record<string, number>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
