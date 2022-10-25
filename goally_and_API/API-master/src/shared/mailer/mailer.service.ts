import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { EnvironmentVariables } from 'src/config';

@Injectable()
export class MailerService {
  private API_KEY: string;
  private BASE_API_URL: string;
  private RESET_EMAIL_TEMPLATE_ID: string;
  private INVITATION_EMAIL_ID: string;
  private ROUTINE_EMAIL_PDF_ID: string;
  private FROM_EMAIL: string;
  private FROM_NAME: string;

  private ABANDONAD_CHECKOUT_LIST_ID: string;
  private LIST_API_URL: string;

  constructor(
    private http: HttpService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.API_KEY = this.config.get('KLAYVIO_API_KEY');
    this.BASE_API_URL = this.config.get('KLAYVIO_API_URL');
    this.FROM_EMAIL = 'goally@support.com';
    this.FROM_NAME = 'Goally Support';
    // TEMPLATES
    this.RESET_EMAIL_TEMPLATE_ID = 'VB6hZ2';
    this.INVITATION_EMAIL_ID = 'RUVsLY';
    this.ROUTINE_EMAIL_PDF_ID = 'VZkTwL';

    //LIST
    this.ABANDONAD_CHECKOUT_LIST_ID = 'WGH4mb';
    this.LIST_API_URL = this.BASE_API_URL.replace('/v1/', '/v2/');
  }

  /**
   *
   * @param to email
   * @param token for pwd reset
   * @returns @returns response from mailer server
   *
   */
  async sendResetMail(
    to: { name: string; email: string },
    token: string,
  ): Promise<string> {
    const data = new FormData();
    const resetPwdUrl = `${this.config.get(
      'FE_BASE_URL',
    )}/auth/reset-password?token=${token}`;

    data.append('to', JSON.stringify([to]));
    data.append('subject', 'Forgot your password?');

    data.append('context', JSON.stringify({ resetPwdUrl }));
    return await this.sendEmail(data, this.RESET_EMAIL_TEMPLATE_ID);
  }
  async sendInvitationEmail(
    to: { name: string; email: string },
    inviteId: string,
    isExistingCustomer: boolean,
  ): Promise<string> {
    console.log(to);
    console.log(inviteId);
    const data = new FormData();
    const DEFAULT_URL = isExistingCustomer ? 'login' : 'sign-up';
    const invitationUrl = `${this.config.get(
      'FE_BASE_URL',
    )}/auth/${DEFAULT_URL}?inviteId=${Buffer.from(inviteId.toString()).toString(
      'base64',
    )}`;

    data.append('to', JSON.stringify([to]));
    data.append('subject', 'Welcome to Goally');

    data.append('context', JSON.stringify({ invitationUrl }));
    return await this.sendEmail(data, this.INVITATION_EMAIL_ID);
  }
  async sendRoutinePdfMail(
    to: { email: string },
    pdfUrl: string,
  ): Promise<string> {
    const data = new FormData();
    data.append('to', JSON.stringify([to]));
    data.append('subject', 'Goally Visual Schedule');

    data.append('context', JSON.stringify({ pdfUrl }));
    return await this.sendEmail(data, this.ROUTINE_EMAIL_PDF_ID);
  }
  /**
   *
   * @param FormData
   * @param TEMPLATE_ID
   * @returns response from mailer server
   *
   */
  private async sendEmail(
    data: FormData,
    TEMPLATE_ID: string,
  ): Promise<string> {
    data.append('api_key', this.API_KEY);
    data.append('from_email', this.FROM_EMAIL);
    data.append('from_name', this.FROM_NAME);
    console.log('sending maile with api key: ', this.API_KEY);
    try {
      const response = await this.http
        .post(`${this.BASE_API_URL}email-template/${TEMPLATE_ID}/send`, data, {
          headers: data.getHeaders(),
        })
        .toPromise();
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.response.message);
    }
  }

  async addProfileToList(email: string) {
    const body = { profiles: { email } };
    const url = `${this.LIST_API_URL}list/${this.ABANDONAD_CHECKOUT_LIST_ID}/members?api_key=${this.API_KEY}`;

    try {
      const res = this.http.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resValue = await lastValueFrom(res);
      return resValue.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async removeProfileFromList(email: string) {
    const body = { emails: [email] };
    const url = `${this.LIST_API_URL}list/${this.ABANDONAD_CHECKOUT_LIST_ID}/members?api_key=${this.API_KEY}`;

    try {
      const res = this.http.delete(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      });
      const resValue = await lastValueFrom(res);
      return resValue.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
