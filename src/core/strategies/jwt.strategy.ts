import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from 'modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'modules/auth/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const extractJwtFromCookie = (request: Request) =>
      ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  public async validate(payload: JwtPayload) {
    const user = await this.userService.getUser(payload.user_id);

    if (!user) {
      throw new UnauthorizedException('validate');
    }

    return user;
  }
}
