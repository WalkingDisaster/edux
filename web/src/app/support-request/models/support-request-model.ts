import { UserService } from '../../common/user.service';

export class SupportRequestModel {
    public changeHistory: Array<SupportRequestModelStateHistoryItem>;
    public assignedTo: string;
    public resolvedBy: string;
    public resolvedOn: Date;

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
