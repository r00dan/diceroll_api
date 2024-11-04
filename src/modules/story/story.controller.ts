import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { StoryService } from './story.service';
import { CurrentUser } from 'core/decorators/current-user.decorator';
import { JwtAuthGuard } from 'core/guards/jwt-auth.guard';
import { GoogleUser } from 'core/strategies/google.strategy';
import { GenerateStoryDto } from './dto/generate-story.dto';
import { getRandomInt } from 'utils/getRandomInt';
import { ContinueStoryDto } from './dto/continue-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  public async getList(@CurrentUser() user: GoogleUser) {
    return await this.storyService.getList(user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getStory(@Query('id') id: string) {
    return await this.storyService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(@CurrentUser() user: GoogleUser) {
    await this.storyService.create({ owner_id: user.id });
  }

  @Post('/generate')
  @UseGuards(JwtAuthGuard)
  public async generate(@Body() { story_id }: GenerateStoryDto) {
    return await this.storyService.generate(story_id);
  }

  @Post('/continue')
  @UseGuards(JwtAuthGuard)
  public async continue(
    @Body() { story_id, selected_option }: ContinueStoryDto,
  ) {
    return await this.storyService.continue(story_id, selected_option);
  }

  @Post('/end')
  @UseGuards(JwtAuthGuard)
  public async end(@Body() { story_id, selected_option }: ContinueStoryDto) {
    return await this.storyService.end(story_id, selected_option);
  }
}
