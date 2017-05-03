import { Injectable } from '@angular/core';

import { FieldWrapper } from './field-wrapper';
import { ListWrapper } from './list-wrapper';
import { WrappedItem } from './wrapped-item';

@Injectable()
export class SoftLockFieldService {
  constructor() { }

  public manage(): SoftLockFieldManager {
    return new SoftLockFieldManager();
  }

}

export class SoftLockFieldManager {
  private items = new Map<string, WrappedItem>();

  constructor() { }

  public wrapField<T>(name: string, accessor: () => T, mutator: (T) => void): FieldWrapper<T> {
    const newField = new FieldWrapper<T>(name, accessor, mutator);
    this.items.set(name, newField);
    return newField;
  }

  public wrapList<T>(name: string, accessor: () => Array<T>, add: (T) => void): ListWrapper<T> {
    const newList = new ListWrapper<T>(name, accessor, add);
    this.items.set(name, newList);
    return newList;
  }

  public get isDirty(): boolean {
    let result: boolean;
    this.items.forEach((value, key) => {
      if (value.isDirty) {
        result = true;
      }
    });
    return result;
  }

  public reset(): void {
    this.items.forEach((value, key) => {
      if (value.isDirty) {
        value.reset();
      }
    });
  }
}
