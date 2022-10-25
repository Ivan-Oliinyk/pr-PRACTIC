import { INestApplication } from '@nestjs/common';
import {
  FallbackExpectionFilter,
  HttpExceptionFilter,
} from 'src/shared/filters';
import { ValidationFilter } from 'src/shared/filters/validation.filter';

export function setupGlobalFilter(app: INestApplication) {
  app.useGlobalFilters(
    new FallbackExpectionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
  );
}
