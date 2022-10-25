import { Types } from 'mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsMongoIdObj(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsMongoIdObj',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsMongoIdObjConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsMongoIdObj' })
class IsMongoIdObjConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return false;

    return Types.ObjectId.isValid(value);
  }
  defaultMessage(args: ValidationArguments) {
    return `$property : ${args.value} must be valid ObjectId `;
  }
}
