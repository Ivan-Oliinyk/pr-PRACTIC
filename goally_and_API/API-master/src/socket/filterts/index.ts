import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  constructor() {
    // super(options)
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    value = typeof value == 'string' ? JSON.parse(value) : value;
    const object = plainToClass(metatype, value);

    const errors = await validate(object);
    const messages = errors.map(
      error => `${error.property} has wrong value ${error.value},
                ${Object.values(error.constraints).join(', ')} `,
    );
    if (errors.length > 0) {
      throw new WsException(messages);
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
