import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../invoice-service/src/schemas/invoice.schema';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;
  let invoiceModel: Model<Invoice>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    invoiceModel = moduleFixture.get<Model<Invoice>>(getModelToken('Invoice'));
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await invoiceModel.deleteMany({});
  });

  it('/POST invoices - should create a new invoice', async () => {
    const createInvoiceDto = {
      customer: 'John Doe',
      amount: 100,
      reference: 'INV-1001',
      date: new Date().toISOString(),
      items: [
        {
          sku: 'ITEM-001',
          qt: 2,
        },
        {
          sku: 'ITEM-002',
          qt: 5,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.customer).toBe(createInvoiceDto.customer);
    expect(response.body.amount).toBe(createInvoiceDto.amount);
    expect(response.body.items.length).toBe(2);
  });

  it('/GET invoices/:id - should retrieve an invoice by id', async () => {
    const invoice = new invoiceModel({
      customer: 'Jane Doe',
      amount: 150,
      reference: 'INV-1002',
      date: new Date(),
      items: [
        { sku: 'ITEM-003', qt: 3 },
        { sku: 'ITEM-004', qt: 7 },
      ],
    });
    await invoice.save();

    const response = await request(app.getHttpServer())
      .get(`/invoices/${invoice._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', String(invoice._id));
    expect(response.body.customer).toBe(invoice.customer);
  });

  it('/GET invoices - should retrieve a list of invoices', async () => {
    await invoiceModel.insertMany([
      {
        customer: 'John Doe',
        amount: 100,
        reference: 'INV-1001',
        date: new Date(),
        items: [{ sku: 'ITEM-001', qt: 2 }],
      },
      {
        customer: 'Jane Doe',
        amount: 200,
        reference: 'INV-1002',
        date: new Date(),
        items: [{ sku: 'ITEM-002', qt: 4 }],
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/invoices')
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[1].customer).toBe('Jane Doe');
  });
});
