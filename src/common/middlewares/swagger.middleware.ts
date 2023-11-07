import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class SwaggerMiddleware implements NestMiddleware {
  use(re: Request, res: Response, next: NextFunction) {}
}
