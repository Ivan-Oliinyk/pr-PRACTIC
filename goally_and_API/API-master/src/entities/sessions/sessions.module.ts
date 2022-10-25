import { Module, Global } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session } from 'inspector';
import { SessionSchema } from './session.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
