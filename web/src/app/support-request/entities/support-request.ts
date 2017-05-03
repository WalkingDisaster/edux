export class SupportRequest {
    public id: number;
    public recorded: Date;
    public recordedBy: string;
    public title: string;
    public description: string;
    public assignedTo: string;
    public changeHistory: Array<SupportRequestStateHistoryItem>;
}

export class SupportRequestStateHistoryItem {
    constructor(
        public changeTime: Date,
        public changedBy: string,
        public changedTo: string,
        public comments: string
    ) { }
}
