import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { HTTP_ONLY_COOKIE_OPTIONS } from 'consts';
import { GoogleOauthGuard } from './google-oauth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  public async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  public async googleAuthCallback(@Req() request, @Res() response: Response) {
    const { access, refresh } = await this.authService.signIn(request.user);

    response.cookie('refresh', refresh, HTTP_ONLY_COOKIE_OPTIONS).send({
      access,
    });
  }
}
