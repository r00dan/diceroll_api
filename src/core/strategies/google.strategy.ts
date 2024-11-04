import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

export interface GoogleUser {
  id: string;
  provider: string;
  email: string;
  name: string;
  username: string;
  picture: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  public async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos, displayName } = profile;

    const user: GoogleUser = {
      id,
      provider: 'google',
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      username: displayName,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
