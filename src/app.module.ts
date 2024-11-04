import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountModule } from './modules/account/account.module';
import { AiModule } from './core/ai/ai.module';
import { AiService } from './core/ai/ai.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoryModule } from './modules/story/story.module';
import { CharacterModule } from './modules/character/character.module';
import { UserController } from 'modules/user/user.controller';
import { StoryController } from 'modules/story/story.controller';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') + 'diceroll',
      }),
      inject: [ConfigService],
    }),
    AiModule,
    UserModule,
    AuthModule,
    StoryModule,
    CharacterModule,
    AccountModule,
    SessionModule,
  ],
  controllers: [UserController, StoryController],
  providers: [],
})
export class AppModule {}
