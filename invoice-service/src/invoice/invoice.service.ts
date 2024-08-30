// src/invoice/invoice.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.create(createInvoiceDto);

      const message = JSON.stringify(invoice);
      this.rabbitMQService.publish('daily_sales_report', message);

      return invoice;
    } catch (error) {
      this.logger.error('Failed to create invoice', error.stack);

      throw new Error('Invoice creation failed');
    }
  }

  async findAll(): Promise<Invoice[]> {
    try {
      return this.invoiceModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to retrieve invoices', error.stack);

      throw new Error('Could not retrieve invoices');
    }
  }

  async findOne(id: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(id).exec();

      if (!invoice) throw new Error('Invoice not found');

      return invoice;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve invoice with id: ${id}`,
        error.stack,
      );

      throw new Error('Could not retrieve the invoice');
    }
  }
}
