import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from './invoice.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class InvoiceCron {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    const invoices = await this.invoiceService.findAll();
    const totalSales = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const itemSales = invoices
      .flatMap((invoice) => invoice.items)
      .reduce((acc, item) => {
        acc[item.sku] = (acc[item.sku] || 0) + item.qt;
        return acc;
      }, {});

    const report = {
      totalSales,
      itemSales,
    };

    await this.rabbitMQService.publish('daily_sales_report', report);
  }
}
