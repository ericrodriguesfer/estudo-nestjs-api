import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { secret } from 'src/config/jwt/config.jwt';

interface TokenPayload {
  iat: number;
  exp: number;
  id: string;
  name: string;
  username: string;
  email: string;
}

function EnsureAuthenticatedMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('JWT token is missign');
    }

    const [, token] = authHeader.split(' ');

    const decoded = verify(token, secret);

    const { id, name, username, email } = decoded as TokenPayload;

    request.user = { id, name, username, email };

    return next();
  } catch (error) {
    throw new UnauthorizedException('JWT token invalid');
  }
}

export default EnsureAuthenticatedMiddleware;
