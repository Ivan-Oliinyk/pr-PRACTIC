import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { defaultTimezone, TEMP_UNITS, timezones } from 'src/shared/const';
import { CLIENT_THEMES } from 'src/shared/const/client-themes';
import { USER_PLANS } from 'src/shared/const/user-plans';
export class CompletedPuzzle {
  _id?: Types.ObjectId;
  name: string;
  piecesNumber: number;
  completedAt: Date;
}
export class AacCongif {
  isSpeakOnSentenceComplete: boolean;
  isVibrateOnClick: boolean;
  wordClickVolume: number;
  talkerVolume: number;
  aacPoints: number;
  clickDelayinSec: number;
  clickSensitivity: number;
  isAutoClearMessage: boolean;
  speechSpeed: number;
  voiceId: string;
  enableSubwords: boolean;
}
export class BalloonCongif {
  poppingSound: boolean;
  speed: number;
  size: number;
  borderThickness: number;
  balloonsCount: number;
}
export class ThemeCongif {
  onboarding: string;
  home: string;
  setting: string;
  daySchedule: string;
  routine: string;
  checklist: string;
  reminder: string;
  talker: string;
  puzzle: string;
  behavior: string;
  reward: string;
  weather: string;
  timer: string;
  wordLab: string;
  balloon: string;
  gameGarage: string;
  help: string;
  bst: string;
}

@Schema({ timestamps: true })
export class Client extends Document {
  @Prop()
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  schoolName: string;

  @Prop()
  teacherName: string;

  @Prop()
  clinicName: string;

  @Prop()
  diagnosis: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Device',
    // unique: true,
    // sparse: true,
  })
  device: Types.ObjectId;

  @Prop({ default: false })
  migrated: boolean;

  @Prop({
    enum: timezones.map(e => e.value),
    default: defaultTimezone,
  })
  timezone: string;
  @Prop({})
  postalCode: string;

  @Prop({})
  avatarURL: string;

  @Prop({
    default: true,
  })
  allowPuzzles: boolean;

  @Prop({
    default: 2,
  })
  puzzlesPerRoutine: number;

  @Prop({
    default: true,
  })
  enableVisualScheduleApp: boolean;

  @Prop({
    default: true,
  })
  allowChildToRedeemRewards: boolean;

  @Prop({
    default: true,
  })
  enableRewardApp: boolean;

  @Prop({
    default: true,
  })
  enableBehaviorTrackerApp: boolean;

  @Prop({
    default: true,
  })
  enableTimerApp: boolean;
  @Prop({
    default: true,
  })
  enableWeather: boolean;

  @Prop({
    default: false,
  })
  hideGearIcon: boolean;

  // @Prop({
  //   default: 30,
  // })
  // gearClickDuration: number;

  @Prop({
    default: true,
  })
  enableDigitalClock: boolean;

  @Prop({
    default: true,
  })
  enableDaySchedule: boolean;

  @Prop({
    type: [
      {
        name: String,
        piecesNumber: Number,
        completedAt: Date,
      },
    ],
  })
  puzzles: CompletedPuzzle[];
  createdAt: Date;

  @Prop()
  address: string;

  @Prop({
    type: AacCongif,
    default: {
      isSpeakOnSentenceComplete: false,
      isVibrateOnClick: false,
      wordClickVolume: 0,
      talkerVolume: 100,
      aacPoints: 0,
      clickDelayinSec: 0.2,
      clickSensitivity: 50,
      isAutoClearMessage: false,
      speechSpeed: 100,
      enableSubwords: false,
    },
  })
  aacConfig: AacCongif;

  @Prop({
    type: BalloonCongif,
    default: {
      poppingSound: true,
      speed: 3,
      size: 3,
      borderThickness: 3,
      balloonsCount: 5,
    },
  })
  balloonConfig: BalloonCongif;

  @Prop({
    default: true,
  })
  enableBalloonApp: boolean;

  @Prop({
    default: true,
  })
  enableTalkerApp: boolean;

  @Prop({
    default: true,
  })
  enableSafetyApp: boolean;

  @Prop()
  puzzlePieces: number;

  @Prop({
    default: TEMP_UNITS.FAHRENHEIT,
  })
  tempUnit: string;

  @Prop({ default: null, enum: Object.values(USER_PLANS).concat(null) })
  plan: string;

  @Prop()
  isSiteLicense: boolean;

  @Prop({
    default: false,
  })
  enableBstApp: boolean;

  deviceName: string;

  @Prop()
  age: number;

  @Prop()
  birthMonth: number;

  @Prop()
  birthDay: number;

  @Prop()
  workGoals: string[];

  @Prop()
  identifications: string[];

  @Prop({
    default: true,
  })
  enableSleepApp: boolean;

  @Prop({
    default: true,
  })
  enableChecklistApp: boolean;

  @Prop({
    default: true,
  })
  enableReminderApp: boolean;

  @Prop({
    default: true,
  })
  enableGameGarageApp: boolean;

  @Prop({
    default: true,
  })
  enableWordLabApp: boolean;

  @Prop({
    type: ThemeCongif,
    default: {
      home: CLIENT_THEMES.PARTY_TIME,
      onboarding: CLIENT_THEMES.PARTY_TIME,
      setting: CLIENT_THEMES.CLASSIC,
      daySchedule: CLIENT_THEMES.CLASSIC,
      routine: CLIENT_THEMES.CLASSIC,
      checklist: CLIENT_THEMES.CLASSIC,
      reminder: CLIENT_THEMES.CLASSIC,
      talker: CLIENT_THEMES.CLASSIC,
      puzzle: CLIENT_THEMES.PARTY_TIME,
      behavior: CLIENT_THEMES.CLASSIC,
      reward: CLIENT_THEMES.CLASSIC,
      weather: CLIENT_THEMES.PARTY_TIME,
      timer: CLIENT_THEMES.CLASSIC,
      wordLab: CLIENT_THEMES.CLASSIC,
      balloon: CLIENT_THEMES.CLASSIC,
      gameGarage: CLIENT_THEMES.CLASSIC,
      help: CLIENT_THEMES.CLASSIC,
      bst: CLIENT_THEMES.CLASSIC,
    },
  })
  themeConfig: ThemeCongif;
}

const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.plugin(aggregatePaginate);
export { ClientSchema };
