import { WrappedItem } from './wrapped-item';

export class FieldWrapper<T> implements WrappedItem {

    private originalValue: T;

    constructor(public name: string, private accessor: () => T, private mutator: (T) => void) {
        this.originalValue = accessor();
    }

    get value(): T {
        return this.accessor();
    }

    set value(toSet: T) {
        this.mutator(toSet);
    }

    get isDirty(): boolean {
        return (this.value !== this.originalValue);
    }

    public reset(): void {
        this.value = this.originalValue;
    }
}