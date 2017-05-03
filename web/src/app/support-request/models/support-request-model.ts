import { UserService } from '../../common/user.service';
import { SoftLockFieldService, SoftLockFieldManager } from '../../common/soft-lock-field.service';

import { SupportRequest, SupportRequestState, SupportRequestStateHistoryItem } from '../entities/support-request';
import { FieldWrapper } from '../../common/field-wrapper';

export class SupportRequestModel {

    private lockManager: SoftLockFieldManager;

    public title: FieldWrapper<string>;
    public description: FieldWrapper<string>;
    public assignedTo: FieldWrapper<string>;
    public changeHistory: Array<SupportRequestModelStateHistoryItem>;

    constructor(
        private lockService: SoftLockFieldService
        , private userService: UserService
        , private entity?: SupportRequest
    ) {
        if (entity === null) {
            this.entity = new SupportRequest();
            this.entity.changeHistory = [
                new SupportRequestStateHistoryItem(new Date(), this.userService.getUserName(), SupportRequestState.Identified, null)
            ];
        }
        this.lockManager = this.lockService.manage();
        this.title = this.lockManager.wrap(
            'title',
            () => entity.title,
            t => entity.title = t
        );
        this.description = this.lockManager.wrap(
            'description',
            () => entity.description,
            d => entity.description = d
        )
        this.assignedTo = this.lockManager.wrap(
            'assignedTo',
            () => entity.assignedTo,
            a => entity.assignedTo = a
        );
    }

    get id(): number {
        return this.entity.id;
    }

    get recorded(): Date {
        return this.entity.recorded;
    }

    get recordedBy(): string {
        return this.entity.recordedBy;
    }

    get resolvedOn(): Date {
        const currentStatus = this.currentStatus;
        if (currentStatus.isFinal) {
            return currentStatus.changeTime;
        }
    }

    get resolvedBy(): string {
        const currentStatus = this.currentStatus;
        if (currentStatus.isFinal) {
            return currentStatus.changedBy;
        }
    }

    get currentStatus(): SupportRequestModelStateHistoryItem {
        let last: SupportRequestStateHistoryItem;
        for (const item of this.entity.changeHistory) {
            if (last === null || item.changeTime > last.changeTime) {
                last = item;
            }
        }
        return new SupportRequestModelStateHistoryItem(last.changeTime, last.changedBy, this.mapEnum(last.changedTo), last.comments);
    }

    private mapEnum(source: SupportRequestState): SupportRequestModelState {
        switch (source) {
            case SupportRequestState.Assigned:
                return SupportRequestModelState.Assigned;
            case SupportRequestState.Identified:
                return SupportRequestModelState.Identified;
            case SupportRequestState.InProgress:
                return SupportRequestModelState.InProgress;
            case SupportRequestState.Rejected:
                return SupportRequestModelState.Rejected;
            case SupportRequestState.Resolved:
                return SupportRequestModelState.Resolved;
        }

    }

    public changeState(newState: SupportRequestModelState, comments: string): void {
        if (this.canChangeState) {
            const currentUser = this.userService.getUserName();
            const now = new Date();
            const toAdd = new SupportRequestModelStateHistoryItem(now, currentUser, newState, comments);
            this.changeHistory.push(toAdd);
        }
    }

    get canChangeState(): boolean {
        return !this.resolvedOn;
    }

    get isDirty(): boolean {
        return this.lockManager.isDirty;
    }

    public reset(): void {
        this.lockManager.reset();
    }
}

export enum SupportRequestModelState {
    Identified,
    Assigned,
    InProgress,
    Resolved,
    Rejected
}

export class SupportRequestModelStateHistoryItem {
    constructor(
        public changeTime: Date,
        public changedBy: string,
        public changedTo: SupportRequestModelState,
        public comments: string
    ) { }

    get isFinal(): boolean {
        return (this.changedTo === SupportRequestModelState.Rejected || this.changedTo === SupportRequestModelState.Resolved);
    }
}
