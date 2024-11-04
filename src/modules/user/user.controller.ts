import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'core/guards/jwt-auth.guard';
import { CurrentUser } from 'core/decorators/current-user.decorator';
import { GoogleUser } from 'core/strategies/google.strategy';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'user' })
  @ApiOkResponse()
  public getUser(@CurrentUser() user: GoogleUser) {
    return this.userService.getUserByEmail(user.email);
  }
}
