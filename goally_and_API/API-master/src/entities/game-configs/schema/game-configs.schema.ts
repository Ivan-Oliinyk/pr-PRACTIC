import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from 'src/entities/clients/schema/client.schema';

export class Game {
  name: string;
  isActive: boolean;
  imgURL: string;
  isHighProcessing: boolean;
}

@Schema({ timestamps: true })
export class GameConfig extends Document {
  @Prop()
  enablePlayLimit: boolean;

  @Prop({
    required: true,
  })
  startTime: string;

  @Prop({
    required: true,
  })
  endTime: string;

  @Prop({
    required: true,
  })
  maxPlayMins: number;

  @Prop()
  enablePtsToPlay: boolean;

  @Prop()
  ptsFor15Mins: number;

  @Prop({
    type: [
      {
        name: String,
        isActive: Boolean,
        imgURL: String,
        isHighProcessing: Boolean,
      },
    ],
    required: true,
  })
  games: Game[];

  @Prop({
    required: true,
    unique: true,
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop()
  duration: number;

  @Prop({ default: 0 })
  magicPlayMins: number;

  @Prop({ default: null })
  magicPlayMinsUpdatedAt: Date;
}

const GameConfigSchema = SchemaFactory.createForClass(GameConfig);

export { GameConfigSchema };
