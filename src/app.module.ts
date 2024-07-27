import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from './modules/account/account.module';
import { AiModule } from './core/ai/ai.module';
import { AiService } from './core/ai/ai.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoryModule } from './modules/story/story.module';
import { CharacterModule } from './modules/character/character.module';
import { UserController } from 'modules/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule.forRoot(),
    AiModule,
    UserModule,
    AuthModule,
    StoryModule,
    CharacterModule,
    AccountModule,
  ],
  controllers: [UserController],
  providers: [AiService],
})
export class AppModule {}
