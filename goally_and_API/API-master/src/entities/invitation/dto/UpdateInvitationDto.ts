import { IsIn } from 'class-validator';
import { USER_TYPES } from 'src/shared/const';

export class UpdateInvitationDto {
  @IsIn(Object.values(USER_TYPES))
  type: string;
}
