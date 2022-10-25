import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/entities/users/users.module';
import { SharedModule } from 'src/shared/shared.module';
import { ClientsModule } from '../clients/clients.module';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { Invitation, InvitationSchema } from './schema/invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),

    forwardRef(() => UsersModule),
    forwardRef(() => SharedModule),
    forwardRef(() => ClientsModule),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
