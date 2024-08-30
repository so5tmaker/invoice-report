// src/email-sender/email-sender.module.ts
import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { EmailService } from './email.service';

@Module({
  imports: [RabbitMQModule],
  providers: [EmailSenderService, EmailService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
