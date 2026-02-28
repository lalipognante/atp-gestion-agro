import { ObligationType } from '@prisma/client';
export declare class CreateObligationDto {
    concept: string;
    amount: number;
    dueDate: string;
    type: ObligationType;
}
