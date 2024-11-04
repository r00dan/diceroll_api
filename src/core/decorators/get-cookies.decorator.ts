import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type CookieProps = 'refresh';

export const GetCookies = createParamDecorator(
  (key: CookieProps, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return key ? request.signedCookies?.[key] : request.cookies;
  },
);
