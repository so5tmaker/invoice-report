import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-invoice'),
    InvoiceModule,
  ],
})
export class AppModule {}
