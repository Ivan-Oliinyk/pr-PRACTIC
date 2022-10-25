import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateReward } from '../dto';

export const rewardSnack: CreateReward = {
  name: 'Snack',
  points: 100,
  showOnDevice: true,
  allowRedeem: true,
  libraryType: LIBRARY_TYPES.ADULT,
  clientId: null,
  imgURL:
    'https://goally-files.s3.amazonaws.com/predefinedRewards/Pretzels.jpg',
  assetSetting: false,
  ordering: 0,
  isVisibleToAudience: true,
};
