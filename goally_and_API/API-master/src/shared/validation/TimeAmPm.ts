import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsTimeAmPm(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsTimeAmPm',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsTimeAmPmConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsTimeAmPm' })
class IsTimeAmPmConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true;
    console.log(value.match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/));
    console.log('*********');
    return value.match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
  }
  defaultMessage(args: ValidationArguments) {
    return `$property : ${args.value} must be valid AM/PM `;
  }
}
