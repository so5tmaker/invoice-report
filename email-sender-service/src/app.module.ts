import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [EmailSenderModule, RabbitMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
