import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSession, AdminSessionSchema } from './admin-session.schema';
import { AdminSessionService } from './admin-session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminSession.name, schema: AdminSessionSchema },
    ]),
  ],
  providers: [AdminSessionService],
  exports: [AdminSessionService],
})
export class AdminSessionModule {}
