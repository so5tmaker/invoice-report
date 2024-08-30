import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('daily_sales_report', { durable: true });
  }

  async consumeQueue(queue: string, callback: (msg: any) => void) {
    if (!this.channel) {
      await this.onModuleInit();
    }
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
