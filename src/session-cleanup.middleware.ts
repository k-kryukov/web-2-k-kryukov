import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Session from 'supertokens-node/recipe/session';

@Injectable()
export class SessionCleanupMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await Session.getSession(req, res, { sessionRequired: false });
    } catch (error) {
      if (error.type === 'TRY_REFRESH_TOKEN') {
        console.warn('Error revoking session: Session is likely expired or invalid.');
		    await Session.refreshSession(req, res);
      } else {
        console.error('Unexpected error during session revocation:', error);
      }
    }
    next();
  }
}