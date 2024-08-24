import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtHeader, SigningKeyCallback, verify } from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: any) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = (client.handshake?.headers.cookie).split("sAccessToken=")[1].split(";")[0]

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    return this.verifyToken(token);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.verifyJwt(token);
      return true;
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid token');
    }
  }

  verifyJwt(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = jwksRsa({
        jwksUri: `${process.env.DOMAIN}/auth/jwt/jwks.json`,
      });

      function getKey(header: JwtHeader, callback: SigningKeyCallback) {
        client.getSigningKey(header.kid, function (err, key) {
          const signingKey = key!.getPublicKey();
          callback(err, signingKey);
        });
      }

      verify(token, getKey, {}, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
