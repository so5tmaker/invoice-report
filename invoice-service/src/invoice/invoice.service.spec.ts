import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from '../schemas/invoice.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;
  let rabbitMQService: RabbitMQService;

  const mockInvoice = {
    _id: '1',
    customer: 'John Doe',
    amount: 100,
    reference: 'INV-001',
    date: new Date(),
    items: [{ sku: 'item1', qt: 2 }],
    save: jest.fn().mockResolvedValue({
      _id: '1',
      customer: 'John Doe',
      amount: 100,
      reference: 'INV-001',
      date: new Date(),
      items: [{ sku: 'item1', qt: 2 }],
    }),
  };

  const mockInvoiceModel = {
    create: jest.fn().mockResolvedValue(mockInvoice),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockInvoice]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockInvoice),
    }),
  };

  const mockRabbitMQService = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: getModelToken(Invoice.name), useValue: mockInvoiceModel },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice and publish a message', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'John Doe',
        amount: 100,
        reference: 'INV-001',
        date: new Date(),
        items: [{ sku: 'item1', qt: 2 }],
      };

      const result = await service.create(createInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(model.create).toHaveBeenCalledWith(createInvoiceDto);
      expect(rabbitMQService.publish).toHaveBeenCalledWith(
        'daily_sales_report',
        JSON.stringify(mockInvoice),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const id = '1';
      const result = await service.findOne(id);
      expect(result).toEqual(mockInvoice);
      expect(model.findById).toHaveBeenCalledWith(id);
    });
  });
});
