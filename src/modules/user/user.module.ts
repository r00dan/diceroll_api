import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MongooseModule.forFeature([UserModel])],
  providers: [UserService, UserController],
  exports: [UserService, UserController],
})
export class UserModule {}
