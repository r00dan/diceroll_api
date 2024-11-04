import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  user_id?: string;
  session_id?: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async signAccessToken(user_id: string) {
    const secret = this.configService.get<string>('ACCESS_SECRET');
    const lifetime = this.configService.get<number>('ACCESS_LIFETIME');

    return await this.jwtService.signAsync(
      { user_id },
      {
        secret,
        expiresIn: this.minutesToSeconds(lifetime),
      },
    );
  }

  public async signRefreshToken(session_id: string) {
    const secret = this.configService.get<string>('REFRESH_SECRET');
    const lifetime = this.configService.get<number>('REFRESH_LIFETIME');

    return await this.jwtService.signAsync(
      { user_id: session_id },
      {
        secret,
        mutatePayload: false,
        expiresIn: this.daysToSeconds(lifetime),
      },
    );
  }

  public async verifyAccessToken(token: string) {
    try {
      const secret = this.configService.get<string>('ACCESS_SECRET');

      return await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
    } catch (error) {
      // if (error.name === 'TokenExpiredError') {
      //   return new UnauthorizedException('Access token has been expired');
      // }
      return new UnauthorizedException('Access token verification failed');
    }
  }

  public async verifyRefreshToken(token: string) {
    try {
      const secret = this.configService.get<string>('REFRESH_SECRET');

      return await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
    } catch (error) {
      // if (error.name === 'TokenExpiredError') {
      //   return new UnauthorizedException('Refresh token has been expired');
      // }
      return new UnauthorizedException('Refresh token verification failed');
    }
  }

  private minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }

  private daysToSeconds(days: number): number {
    return days * 24 * 60 * 60;
  }
}
