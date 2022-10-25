import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientFeatureAccessController } from './client-feature-access.controller';
import { ClientFeatureAccessService } from './client-feature-access.service';
import {
  ClientFeatureAccess,
  ClientFeatureAccessSchema,
} from './schema/client-feature-access.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientFeatureAccess.name, schema: ClientFeatureAccessSchema },
    ]),
  ],
  controllers: [ClientFeatureAccessController],
  providers: [ClientFeatureAccessService],
  exports: [ClientFeatureAccessService],
})
export class ClientFeatureAccessModule {}
