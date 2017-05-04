import { WrappedItem } from './wrapped-item';

import { Debouncable, UtilityService } from '../common/utility.service';

export class FieldWrapper<T> implements WrappedItem, Debouncable {
    timeoutId: number;

    private editing = false;
    private originalValue: T;

    public locked = false;
    public lockedBy = null;

    constructor(
        private utilityService: UtilityService
        , private socket: SocketIOClient.Socket
        , private id: number
        , private userName: string
        , public name: string
        , private accessor: () => T
        , private mutator: (T) => void) {

        this.originalValue = accessor();

        socket.on(`editing-${id}-${this.name}`, data => {
            this.locked = true;
            this.lockedBy = data.userName;
        });
        socket.on(`released-${id}-${this.name}`, data => {
            this.locked = false;
            this.lockedBy = null;
            this.mutator(data.value);
        });
    }

    get value(): T {
        return this.accessor();
    }

    set value(toSet: T) {
        if (!this.editing) {
            this.socket.emit('editing', {
                id: this.id,
                userName: this.userName,
                fieldName: this.name
            });
            this.editing = true;
        }
        this.utilityService.debounce(this, 5000).forEach(() => {
            this.socket.emit('release', {
                id: this.id,
                userName: this.userName,
                fieldName: this.name,
                value: this.value
            });
            this.editing = false;
        });
        this.mutator(toSet);
    }

    get isDirty(): boolean {
        return (this.value !== this.originalValue);
    }

    public reset(): void {
        this.value = this.originalValue;
    }
}