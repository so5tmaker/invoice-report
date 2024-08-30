// src/invoice/schemas/invoice.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Invoice extends Document {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({
    type: [{ sku: String, qt: Number }],
    _id: false,
  })
  items: Array<{ sku: string; qt: number }>;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
