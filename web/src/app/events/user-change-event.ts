export class UserChangeEvent {
    constructor(public userName: string, public type: UserChangeType) { }
}

export enum UserChangeType {
    Joined,
    Left,
    Typing,
    StoppedTyping
}