import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModel } from './infra/user.schema';
import { UserService } from './use-case/user.service';
import { UserController } from './user.controller';
import { Database } from 'enums';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') + Database.USERS,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([UserModel]),
  ],
  providers: [UserService, UserController],
  exports: [UserService, UserController],
})
export class UserModule {}
