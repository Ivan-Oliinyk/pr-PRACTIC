import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config';

@Injectable()
export class TinyUrlService {
  private API_KEY: string;
  private BASE_API_URL: string;

  constructor(
    private http: HttpService,
    private config: ConfigService<EnvironmentVariables>,
  ) {
    this.API_KEY = this.config.get('TINY_URL_API_KEY');
    this.BASE_API_URL = 'https://api.tinyurl.com/';
  }

  async getShortUrl(longUrl: string): Promise<string> {
    const data = {
      url: longUrl,
    };
    const config = {
      headers: { Authorization: `Bearer ${this.API_KEY}` },
    };
    try {
      const response = await this.http
        .post(`${this.BASE_API_URL}create/`, data, config)
        .toPromise();
      console.log(response.data);
      return response.data.data.tiny_url;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.response.message);
    }
  }
}
