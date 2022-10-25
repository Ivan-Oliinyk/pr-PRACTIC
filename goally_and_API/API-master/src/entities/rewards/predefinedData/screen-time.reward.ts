import { LIBRARY_TYPES } from 'src/shared/const';
import { CreateReward } from '../dto';

export const rewardScreenTime: CreateReward = {
  name: '15 minutes of screen time',
  points: 200,
  showOnDevice: true,
  allowRedeem: false,
  libraryType: LIBRARY_TYPES.ADULT,
  clientId: null,
  imgURL:
    'https://goally-files.s3.amazonaws.com/predefinedRewards/Screentime.jpg',
  assetSetting: false,
  ordering: 1,
  isVisibleToAudience: true,
};
