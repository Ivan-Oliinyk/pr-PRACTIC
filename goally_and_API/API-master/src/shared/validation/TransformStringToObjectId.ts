import { Types } from 'mongoose';

export function TransformStringToObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  console.log('TRANSFORMING');
  return new Types.ObjectId(id);
}
