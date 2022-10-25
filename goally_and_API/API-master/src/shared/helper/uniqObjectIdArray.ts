import { uniqBy } from 'lodash';
import { Types } from 'mongoose';

export const uniqObjectIdsArray = (arr: Types.ObjectId[]) =>
  uniqBy(arr, id => id.toString());
