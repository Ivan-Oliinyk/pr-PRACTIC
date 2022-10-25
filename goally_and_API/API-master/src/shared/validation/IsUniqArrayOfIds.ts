import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsUniqArrayOfIds(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsUniqArrayOfIds',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsUniqArrayOfIdsConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsUniqArrayOfIds' })
class IsUniqArrayOfIdsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const uniqArray = [...new Set(value)];
    return uniqArray.length === value.length;
  }
  defaultMessage(args: ValidationArguments) {
    return `$property : ${args.value} must be uniq array `;
  }
}
