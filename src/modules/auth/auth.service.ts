import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';
import { UserService } from 'modules/user/use-case/user.service';
import { GoogleUser } from './google.strategy';

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
}
