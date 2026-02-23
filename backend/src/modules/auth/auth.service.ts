import { Injectable, ConflictException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: CreateUserDto) {
  const existingUser = await this.authRepository.findByEmail(dto.email);

  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const role = dto.role ?? Role.ADMIN;

  const user = await this.authRepository.create({
    email: dto.email,
    passwordHash,
    role,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
}