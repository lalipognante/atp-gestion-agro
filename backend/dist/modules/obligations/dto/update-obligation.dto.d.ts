import { ObligationType } from '@prisma/client';
export declare class UpdateObligationDto {
    concept?: string;
    amount?: number;
    dueDate?: string;
    type?: ObligationType;
}
