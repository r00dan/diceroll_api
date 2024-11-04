import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { HTTP_ONLY_COOKIE_OPTIONS } from 'consts';
import { GoogleOauthGuard } from '../../core/guards/google-oauth.guard';
import { AuthService } from './auth.service';
import { GetCookies } from 'core/decorators/get-cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  public async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  public async googleAuthCallback(@Req() request, @Res() response: Response) {
    const user = request.user;
    const { access, refresh } = await this.authService.signIn(user);

    response
      .cookie('refresh', refresh, HTTP_ONLY_COOKIE_OPTIONS)
      .redirect(
        `http://localhost:3000/auth/success?access=${encodeURIComponent(JSON.stringify(access))}`,
      );
  }

  @Get('refresh')
  public async refresh(
    @GetCookies('refresh') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const [newAccessToken, newRefreshToken] =
      await this.authService.refreshTokens(refreshToken);
    response.cookie('refresh', newRefreshToken, HTTP_ONLY_COOKIE_OPTIONS).send({
      token: newAccessToken,
    });
  }
}
