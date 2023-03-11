import { Request } from 'express';
import { User } from 'entities';

export interface HttpRequest extends Request {
  user: User;
  address: string;
}
