import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    register(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
}
