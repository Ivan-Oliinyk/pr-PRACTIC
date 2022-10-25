import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/shared/filters/validation.exception';

export function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
      // skipMissingProperties
      exceptionFactory: (errors: ValidationError[]) => {
        console.log(errors);
        const messages = errors.map(getError);
        return new ValidationException(messages);
      },
    }),
  );
  function getError(error) {
    const childrenError = error.children;
    if (childrenError.length) {
      return childrenError.map(getError);
    } else {
      return `${error.property} has wrong value ${error.value},
                ${Object.values(error.constraints).join(', ')}`;
    }
  }
}
