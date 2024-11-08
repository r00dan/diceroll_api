import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../../core/strategies/google.strategy';
import { TokenService } from './token.service';
import { UserService } from 'modules/user/user.service';
import { UserModule } from 'modules/user/user.module';
import { UserModel } from 'modules/user/user.schema';

@Module({
  imports: [UserModule, MongooseModule.forFeature([UserModel])],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    TokenService,
    UserService,
    JwtService,
  ],
  exports: [TokenService],
})
export class AuthModule {}
