export class UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'VIEWER';
  createdAt: Date;
  updatedAt: Date;
}