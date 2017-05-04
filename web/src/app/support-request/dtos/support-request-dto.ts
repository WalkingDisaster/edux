import { SupportRequest } from '../entities/support-request';

export interface SupportRequestDto {
    item: SupportRequest;
    viewers: Set<string>;
    locked: boolean;
    lockedBy: string;
}