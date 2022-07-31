import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

class Product {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  @IsNumber()
  price: number;
}

class Item {
  product: Product;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class NewOrderDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDateString()
  date: string;

  items: Item[];
}
