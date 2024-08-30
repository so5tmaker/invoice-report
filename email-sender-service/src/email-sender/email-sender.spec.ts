import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from './email-sender.service';
import { EmailService } from './email.service';

describe('EmailSenderService', () => {
  let service: EmailSenderService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailSenderService,
        {
          provide: EmailService,
          useValue: {
            sendReport: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should send a report', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    await service.sendReport(to, subject, body);

    expect(emailService.sendReport).toHaveBeenCalledWith(to, subject, body);
  });
});
