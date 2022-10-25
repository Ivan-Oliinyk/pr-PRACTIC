import { Injectable } from '@nestjs/common';
import { UsersService } from './entities/users/users.service';
@Injectable()
export class AppService {
  constructor(private userService: UsersService) {}
  getHello(): string {
    return 'pong';
  }
}
