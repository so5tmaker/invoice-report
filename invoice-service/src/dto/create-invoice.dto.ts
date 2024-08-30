import {
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  qt: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
