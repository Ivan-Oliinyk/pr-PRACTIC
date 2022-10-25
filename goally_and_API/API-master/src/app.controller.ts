import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { AppService } from './app.service';
import { timezones } from './shared/const';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get('/ping')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/timezones')
  getTimeZones(): { value: string; text: string }[] {
    return timezones;
  }

  @Get('/health')
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }

  @Get('/wrapper-setting')
  @HealthCheck()
  wrapper() {
    return {
      showWrapper: true,
    };
  }
}
