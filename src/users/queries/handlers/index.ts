import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserInfoHandler } from './get-user-info.handler';
import { GetUsersInfoHandler } from './get-users-info.handler';

export const queryHandlers = [
  GetUserInfoHandler,
  GetUsersInfoHandler,
  GetUserByIdHandler,
];
