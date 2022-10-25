import { SoundTypeDto } from '../dto/SoundType';

export const puzzleSound: SoundTypeDto[] = [
  {
    event: 'Correct Spot',
    volume: 100,
    audioList: [
      {
        name: 'Silent',
        url: '',
        isSelected: false,
      },
      {
        name: 'Buzz',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/buzz.mp3',
        isSelected: false,
      },
      {
        name: 'Coin',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/coin.mp3',
        isSelected: false,
      },
      {
        name: 'Positive',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/positive.mp3',
        isSelected: false,
      },
      {
        name: 'Tada',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/tadaa.mp3',
        isSelected: false,
      },
      {
        name: 'Way To Go (Kid)',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/way_to_go_kid.mp3',
        isSelected: false,
      },
      {
        name: 'Way To Go (Adult)',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/way_to_go_adult.mp3',
        isSelected: false,
      },
      {
        name: 'Bing',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/bing.mp3',
        isSelected: false,
      },
      {
        name: 'Announcement',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/announcement.mp3',
        isSelected: false,
      },
      {
        name: 'Big Applause',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/big_applause.mp3',
        isSelected: false,
      },
      {
        name: 'Orchestra',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/orchestra.mp3',
        isSelected: false,
      },
      {
        name: 'Piano',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/piano.mp3',
        isSelected: false,
      },
      {
        name: 'Playground',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/playground.mp3',
        isSelected: false,
      },
      {
        name: 'Trumpet',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/trumpet.mp3',
        isSelected: false,
      },
      {
        name: 'Ukelele',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/ukelele.mp3',
        isSelected: false,
      },
      {
        name: 'Vibraphone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/vibraphone.mp3',
        isSelected: false,
      },
      {
        name: 'Xylophone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/xylophone.mp3',
        isSelected: true,
      },
    ],
  },
  {
    event: 'Incorrect Spot',
    volume: 100,
    audioList: [
      {
        name: 'Silent',
        url: '',
        isSelected: false,
      },
      {
        name: 'Buzz',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/buzz.mp3',
        isSelected: false,
      },
      {
        name: 'Incorrect Bell',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/incorrect_bell.wav',
        isSelected: false,
      },
      {
        name: 'Error',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/error.wav',
        isSelected: false,
      },
      {
        name: 'Rooster',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/rooster.mp3',
        isSelected: false,
      },
      {
        name: 'Bing',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/bing.mp3',
        isSelected: false,
      },
      {
        name: 'Announcement',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/announcement.mp3',
        isSelected: false,
      },
      {
        name: 'Big Applause',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/big_applause.mp3',
        isSelected: false,
      },
      {
        name: 'Orchestra',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/orchestra.mp3',
        isSelected: false,
      },
      {
        name: 'Piano',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/piano.mp3',
        isSelected: false,
      },
      {
        name: 'Playground',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/playground.mp3',
        isSelected: false,
      },
      {
        name: 'Trumpet',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/trumpet.mp3',
        isSelected: true,
      },
      {
        name: 'Ukelele',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/ukelele.mp3',
        isSelected: false,
      },
      {
        name: 'Vibraphone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/vibraphone.mp3',
        isSelected: false,
      },
      {
        name: 'Xylophone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/xylophone.mp3',
        isSelected: false,
      },
    ],
  },
  {
    event: 'Complete Puzzle',
    volume: 100,
    audioList: [
      {
        name: 'Silent',
        url: '',
        isSelected: false,
      },
      {
        name: 'Buzz',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/buzz.mp3',
        isSelected: false,
      },
      {
        name: 'Applause',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/applause.mp3',
        isSelected: false,
      },
      {
        name: 'Cheering',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/cheering.mp3',
        isSelected: false,
      },
      {
        name: 'Complete',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/complete.wav',
        isSelected: false,
      },
      {
        name: 'Tada',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/tada.mp3',
        isSelected: false,
      },
      {
        name: 'Victory',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/victory.mp3',
        isSelected: false,
      },
      {
        name: 'Win 8 Bit',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/win_8_bit.mp3',
        isSelected: false,
      },
      {
        name: 'Announcement',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/announcement.mp3',
        isSelected: false,
      },
      {
        name: 'Big Applause',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/big_applause.mp3',
        isSelected: false,
      },
      {
        name: 'Orchestra',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/orchestra.mp3',
        isSelected: true,
      },
      {
        name: 'Piano',
        url: 'https://goally-files.s3.amazonaws.com/predefinedSounds/piano.mp3',
        isSelected: false,
      },
      {
        name: 'Playground',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/playground.mp3',
        isSelected: false,
      },
      {
        name: 'Trumpet',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/trumpet.mp3',
        isSelected: false,
      },
      {
        name: 'Ukelele',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/ukelele.mp3',
        isSelected: false,
      },
      {
        name: 'Vibraphone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/vibraphone.mp3',
        isSelected: false,
      },
      {
        name: 'Xylophone',
        url:
          'https://goally-files.s3.amazonaws.com/predefinedSounds/xylophone.mp3',
        isSelected: false,
      },
    ],
  },
];
