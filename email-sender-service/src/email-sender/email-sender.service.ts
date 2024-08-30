// src/email-sender/email-sender.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';
import { EmailService } from './email.service';

@Injectable()
export class EmailSenderService implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private readonly emailService: EmailService) {}

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('daily_sales_report');

    this.channel.consume('daily_sales_report', async (msg) => {
      if (msg !== null) {
        const report = JSON.parse(msg.content.toString());
        await this.emailService.sendReport(
          'mail',
          'report',
          JSON.stringify(report),
        );
        this.channel.ack(msg);
      }
    });
  }

  async sendReport(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.emailService.sendReport(to, subject, body);
    } catch (error) {
      this.logger.error('Failed to send report email', error.stack);

      throw new Error('Email sending failed');
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
