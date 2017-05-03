import { UserService } from '../../common/user.service';

import { SupportRequest, SupportRequestState } from '../entities/support-request';

export class SupportRequestModel {
    public changeHistory: Array<SupportRequestModelStateHistoryItem>;
    public assignedTo: string;
    public resolvedBy: string;
    public resolvedOn: Date;

    static mapFrom(entity: SupportRequest, userService: UserService): SupportRequestModel {
        const result = new SupportRequestModel(
            userService,
            entity.id,
            entity.recorded,
            entity.recordedBy,
            entity.title,
            entity.description);
        result.assignedTo = entity.assignedTo;
        const sortedHistory = entity.changeHistory.sort((a, b) => {
            if (a.changeTime === b.changeTime) {
                return 0;
            } else if (a.changeTime < b.changeTime) {
                return -1;
            }
            return 1;
        });
        for (const item of sortedHistory) {
            let newState: SupportRequestModelState;
            switch (item.changedTo) {
                case SupportRequestState.Assigned:
                    newState = SupportRequestModelState.Assigned;
                    break;
                case SupportRequestState.Identified:
                    newState = SupportRequestModelState.Identified;
                    break;
                case SupportRequestState.InProgress:
                    newState = SupportRequestModelState.InProgress;
                    break;
                case SupportRequestState.Rejected:
                    newState = SupportRequestModelState.Rejected;
                    result.resolvedBy = item.changedBy;
                    result.resolvedOn = item.changeTime;
                    break;
                case SupportRequestState.Resolved:
                    newState = SupportRequestModelState.Resolved;
                    result.resolvedBy = item.changedBy;
                    result.resolvedOn = item.changeTime;
                    break;
            }

            const toAdd = new SupportRequestModelStateHistoryItem(
                item.changeTime,
                item.changedBy,
                newState,
                item.comments
            );
            result.changeHistory.push(toAdd);
        }

        return result;
    }

    constructor(
        private userService: UserService
        , public id: number
        , public recorded: Date
        , public recordedBy: string
        , public title: string
        , public description: string
    ) {
        this.changeHistory = [
            new SupportRequestModelStateHistoryItem(
                new Date(),
                this.recordedBy,
                SupportRequestModelState.Identified,
                null
            )
        ];
    }

    public assignTo(userName: string): void {
        this.assignedTo = userName;
    }

    public changeState(newState: SupportRequestModelState, comments: string): void {
        if (this.canChangeState) {
            const currentUser = this.userService.getUserName();
            const now = new Date();
            const toAdd = new SupportRequestModelStateHistoryItem(now, currentUser, newState, comments);
            this.changeHistory.push(toAdd);
            if (newState === SupportRequestModelState.Resolved || newState === SupportRequestModelState.Rejected) {
                this.resolvedBy = currentUser;
                this.resolvedOn = now;
            }
        }
    }

    get canChangeState() {
        return !this.resolvedOn;
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
}
