import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { WrappedItem } from './wrapped-item';

export class ListWrapper<T> implements WrappedItem {

    private list: Array<T>;
    private myNewItems = new Array<T>();

    public newListItems = new Subject<T>();

    constructor(public name: string, private accessor: () => ArrayLike<T>, private add: (T) => void) {
        this.list = Array.from(accessor());
    }

    get items(): Array<T> {
        return this.list;
    }

    public addItem(item: T): void {
        this.myNewItems.push(item);
        this.list.push(item);
        this.newListItems.next(item);
    }

    get isDirty(): boolean {
        return (this.myNewItems.length > 0);
    }

    public reset(): void {
        const filtered = this.list.filter((val, idx) => {
            for (const newItem of this.myNewItems) {
                if (val === newItem) {
                    return false;
                }
            }
            return true;
        });
        this.list = Array.from(filtered);
        this.myNewItems = new Array<T>();
    }
}