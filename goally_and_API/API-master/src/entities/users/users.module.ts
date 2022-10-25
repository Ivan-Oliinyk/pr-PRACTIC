import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from 'src/entities/sessions/sessions.module';
import { RedisModule } from 'src/redis/redis.module';
import { SharedModule } from 'src/shared/shared.module';
import { AdminConfigModule } from '../admin-config/admin-config.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Organization, OrganizationSchema, User, UserSchema } from './schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    RedisModule,
    SessionsModule,
    SharedModule,
    SubscriptionModule,
    ReferralsModule,
    AdminConfigModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
