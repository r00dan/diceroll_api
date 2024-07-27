import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './use-case/user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ description: 'test' })
  @ApiOkResponse()
  public getUser(@Query('user_id') user_id: string) {
    return this.userService.getUser(user_id);
  }
}
