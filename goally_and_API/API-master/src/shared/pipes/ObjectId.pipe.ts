import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid Param should be Types.ObjectId');
    }

    const objectId: Types.ObjectId = new Types.ObjectId(value);
    return objectId;
  }
}

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    console.log(value);
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
