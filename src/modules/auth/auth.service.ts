import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';
import { UserService } from 'modules/user/user.service';
import { GoogleUser } from '../../core/strategies/google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  public async signIn(user?: GoogleUser) {
    if (!user) {
      throw new UnauthorizedException();
    }

    let candidate = await this.userService.getUserByEmail(user.email);

    if (!candidate) {
      candidate = await this.userService.create({
        google_id: user.id,
        full_name: user.name,
        username: user.username,
        email: user.email,
        avatar_url: user.picture,
      });
    }

    return {
      access: await this.tokenService.signAccessToken(candidate.id),
      refresh: await this.tokenService.signRefreshToken(candidate.id),
    };
  }

  public async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const validationResult =
      await this.tokenService.verifyRefreshToken(refreshToken);

    if (validationResult instanceof UnauthorizedException) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.tokenService.signAccessToken(
      validationResult.user_id,
    );
    const newRefreshToken = await this.tokenService.signRefreshToken(
      validationResult.user_id,
    );

    return [newAccessToken, newRefreshToken];
  }
}
