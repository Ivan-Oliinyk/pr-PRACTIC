import { GeneralSoundTypeDto } from '../dto/GeneralSoundTypeDto';
import { SoundTypeDto } from '../dto/SoundType';

export const generalSound: SoundTypeDto[] = [
  {
    event: 'Button clicks',
    volume: 100,
    audioList: [
      {
        name: 'Silent',
        url: '',
        isSelected: true,
      },
      {
        name: 'Buzz',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/buzz.mp3',
        isSelected: false,
      },
      {
        name: 'Button Bop',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/button_bop.mp3',
        isSelected: false,
      },
      {
        name: 'Button Two Tone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/button_two_tone.mp3',
        isSelected: false,
      },
      {
        name: 'Positive',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/positive.mp3',
        isSelected: false,
      },
    ],
  },
];

export const generalNewSound: GeneralSoundTypeDto = {
  enableSoundSettings: true,
  allowAdjustVolume: true,
  allowChangeSound: true,
  voiceId: 'Matthew',
  volume: 100,
  enableReduceVolume: false,
  reduceVolumeBy: 0,
  schedule: null,
  masterVolume: 100,
  vibrateOnClick: false,
};
