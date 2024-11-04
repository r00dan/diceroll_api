import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { GoogleUser } from 'core/strategies/google.strategy';

type ExtendedRequest = Request & { user: GoogleUser };

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();

    return request.user;
  },
);
