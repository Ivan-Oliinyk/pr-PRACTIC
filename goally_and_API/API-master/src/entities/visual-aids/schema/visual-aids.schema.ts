import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from 'src/entities/users/schema';
import { AIDS_CATEGORIES } from 'src/shared/const/visual-aid-categories';
import { AIDS_TYPES } from 'src/shared/const/visual-aid-types';

@Schema({ timestamps: true })
export class VisualAid extends Document {
  @Prop({})
  name: string;

  @Prop({
    enum: [
      AIDS_CATEGORIES.BEHAVIORS,
      AIDS_CATEGORIES.CHORES,
      AIDS_CATEGORIES.CLOTHES,
      AIDS_CATEGORIES.FOOD,
      AIDS_CATEGORIES.HYGIENE,
      AIDS_CATEGORIES.MACHINES,
      AIDS_CATEGORIES.OTHER,
      AIDS_CATEGORIES.PEOPLE,
      AIDS_CATEGORIES.PETS,
      AIDS_CATEGORIES.REWARDS,
      AIDS_CATEGORIES.ROUTINES,
      AIDS_CATEGORIES.SCHOOL,
      AIDS_CATEGORIES.SPORTS,
      AIDS_CATEGORIES.WEATHER,
      AIDS_CATEGORIES.AAC,
      AIDS_CATEGORIES.BATHROOM,
      AIDS_CATEGORIES.KITCHEN,
    ],
    required: true,
  })
  category: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({
    enum: [
      AIDS_TYPES.SYMBOL,
      AIDS_TYPES.PICTURE,
      AIDS_TYPES.VIDEO,
      AIDS_TYPES.USER_PICTURE,
      AIDS_TYPES.USER_VIDEO,
    ],
    required: true,
  })
  aidType: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop()
  url: string;

  @Prop()
  size: number;

  @Prop()
  lowResUrl: string;
}
const VisualAidsSchema = SchemaFactory.createForClass(VisualAid);
VisualAidsSchema.plugin(mongoosePaginate);
export { VisualAidsSchema };
