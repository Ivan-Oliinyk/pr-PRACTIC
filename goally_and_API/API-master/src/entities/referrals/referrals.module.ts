import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecurlyModule } from 'src/shared/recurly/recurly.module';
import { UsersModule } from '../users/users.module';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';
import { Referrals, ReferralsSchema } from './schema/referrals.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referrals.name, schema: ReferralsSchema },
    ]),
    RecurlyModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
