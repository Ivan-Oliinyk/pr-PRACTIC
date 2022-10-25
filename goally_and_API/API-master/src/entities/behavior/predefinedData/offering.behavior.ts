import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateBehavior } from '../dto';

export const behaviorOffering: CreateBehavior = {
  name: 'Offering to help with chore ',
  points: 30,
  showOnDevice: true,
  libraryType: LIBRARY_TYPES.ADULT,
  ordering: 1,
};
