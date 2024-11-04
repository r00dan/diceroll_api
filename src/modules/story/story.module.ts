import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Database } from 'enums';
import { StoryModel } from './story.schema';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { JwtStrategy } from 'core/strategies/jwt.strategy';
import { UserModule } from 'modules/user/user.module';
import { AiModule } from 'core/ai/ai.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') + Database.STORY,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([StoryModel]),
    UserModule,
    AiModule,
  ],
  providers: [StoryService, StoryController, JwtStrategy],
  exports: [StoryService, StoryController],
})
export class StoryModule {}
