import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
class Customer {
  @Prop()
  id: string;

  @Prop()
  name: string;
}

@Schema()
class Product {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;
}

@Schema()
class Item {
  @Prop({ type: Product })
  product: Product;

  @Prop()
  quantity: number;
}

@Schema()
export class Order {
  @Prop({ unique: true })
  id: string;

  @Prop()
  date: string;

  @Prop({ type: Customer })
  customer: Customer;

  @Prop()
  items: Types.Array<Item[]>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
