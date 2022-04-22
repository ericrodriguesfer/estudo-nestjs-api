import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const UserDecorator = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.user;
  },
);

export default UserDecorator;
