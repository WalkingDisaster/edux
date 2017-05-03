import { Observable } from 'rxjs/Observable';

import { UserService } from '../../common/user.service';
import { SoftLockFieldService, SoftLockFieldManager } from '../../common/soft-lock-field.service';

import { SupportRequest, SupportRequestStateHistoryItem } from '../entities/support-request';
import { FieldWrapper } from '../../common/field-wrapper';
import { ListWrapper } from '../../common/list-wrapper';

export class SupportRequestModel {

    private lockManager: SoftLockFieldManager;

    public title: FieldWrapper<string>;
    public description: FieldWrapper<string>;
    public assignedTo: FieldWrapper<string>;
    public changeHistory: ListWrapper<SupportRequestStateHistoryItem>;

    constructor(
        private lockService: SoftLockFieldService
        , private userService: UserService
        , private entity?: SupportRequest
    ) {
        if (entity === null) {
            this.entity = new SupportRequest();
            this.entity.changeHistory = [
                new SupportRequestStateHistoryItem(new Date(), this.userService.getUserName(), 'Identified', null)
            ];
        }
        this.lockManager = this.lockService.manage();
        this.title = this.lockManager.wrapField(
            'title',
            () => entity.title,
            t => entity.title = t
        );
        this.description = this.lockManager.wrapField(
            'description',
            () => entity.description,
            d => entity.description = d
        )
        this.assignedTo = this.lockManager.wrapField(
            'assignedTo',
            () => entity.assignedTo,
            a => entity.assignedTo = a
        );
        this.changeHistory = this.lockManager.wrapList(
            'historyList',
            () => entity.changeHistory,
            h => entity.changeHistory.push(h)
        )
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
        if (this.statusIsFinal(currentStatus.changedTo)) {
            return currentStatus.changeTime;
        }
    }

    get resolvedBy(): string {
        const currentStatus = this.currentStatus;
        if (this.statusIsFinal(currentStatus.changedTo)) {
            return currentStatus.changedBy;
        }
    }

    private statusIsFinal(status: string) {
        return (status === 'Resolved' || status === 'Rejected');
    }

    get currentStateString(): string {
        const current = this.currentStatus;
        return this.currentStatus.changedTo;
    }

    get currentStatus(): SupportRequestStateHistoryItem {
        let last: SupportRequestStateHistoryItem;
        for (const item of this.entity.changeHistory) {
            if (!last) {
                last = item;
            } else if (item.changeTime > last.changeTime) {
                last = item;
            }
        }
        return last;
    }

    public changeState(newState: string, comments: string): void {
        if (this.canChangeState) {
            const currentUser = this.userService.getUserName();
            const now = new Date();
            const toAdd = new SupportRequestStateHistoryItem(now, currentUser, newState, comments);
            this.changeHistory.addItem(toAdd);
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
