import { User } from '@/lib/types/user';
import { BaseService, BaseListResponse } from './base';

interface UsersResponse extends BaseListResponse {
  users: User[];
}

class UsersService extends BaseService<User, UsersResponse> {
  constructor() {
    super('users');
  }
}

export const usersService = new UsersService(); 