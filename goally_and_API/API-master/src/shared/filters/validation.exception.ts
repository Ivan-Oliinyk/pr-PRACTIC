import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public errors: string[]) {
    super();
  }
}
