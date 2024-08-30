// src/invoice/invoice.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceCron } from './invoice.cron';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RabbitMQModule,
    ScheduleModule.forRoot(),
  ],
  providers: [InvoiceService, InvoiceCron],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
