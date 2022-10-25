import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function GreaterOrEqualThen(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: GreaterOrEqualThenConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'GreaterOrEqualThen' })
class GreaterOrEqualThenConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value >= relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    return `$property : ${args.value} must be greater or equal ${args.constraints} `;
  }
}
