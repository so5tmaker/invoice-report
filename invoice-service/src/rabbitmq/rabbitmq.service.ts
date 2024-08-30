import { Injectable } from '@nestjs/common';
import { Connection, Channel, connect } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('daily_sales_report', { durable: true });
  }

  async publish(queue: string, message: any) {
    if (!this.channel) throw new Error('Channel is not initialized');

    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
