import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config';
import * as twilio from 'twilio';

@Injectable()
export class MessangerService {
  private TWILIO_ACCOUNT_SID: string;
  private TWILIO_AUTH_TOKEN: string;
  private TWILIO_FROM_NUM: string;
  private client: twilio.Twilio;

  BASE_API_URL = '';

  constructor(private config: ConfigService<EnvironmentVariables>) {
    this.TWILIO_ACCOUNT_SID = this.config.get('TWILIO_ACCOUNT_SID');
    this.TWILIO_AUTH_TOKEN = this.config.get('TWILIO_AUTH_TOKEN');
    this.TWILIO_FROM_NUM = this.config.get('TWILIO_FROM_NUM');

    this.client = new twilio.Twilio(
      this.TWILIO_ACCOUNT_SID,
      this.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(body: string, to: string): Promise<string> {
    if (!to.includes('+')) to = '+' + to;

    console.log('Message body', body);
    try {
      const response = await this.client.messages.create({
        body,
        from: this.TWILIO_FROM_NUM,
        to: to.trim(),
      });

      console.log('SMS sent successfully', response.sid);
      return response.sid;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }
  }
}
