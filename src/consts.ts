import { CookieOptions } from "express";

export const HTTP_ONLY_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  signed: true,
  secure: true,
  sameSite: 'none',
};
