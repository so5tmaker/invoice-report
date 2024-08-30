// src/email-sender/email.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendReport(to: string, subject: string, body: string): Promise<void> {
    console.log('Sending email with report:', { to, subject, body });
  }
}
