import { Injectable } from '@angular/core';

import { FieldWrapper, WrappedField } from './field-wrapper';

@Injectable()
export class SoftLockFieldService {
  constructor() { }

  public manage(): SoftLockFieldManager {
    return new SoftLockFieldManager();
  }

}

export class SoftLockFieldManager {
  private fields = new Map<string, WrappedField>();

  constructor() { }

  public wrap<T>(name: string, accessor: () => T, mutator: (T) => void): FieldWrapper<T> {
    const newField = new FieldWrapper<T>(name, accessor, mutator);
    this.fields.set(name, newField);
    return newField;
  }

  public get isDirty(): boolean {
    let result: boolean;
    this.fields.forEach((value, key) => {
      if (value.isDirty) {
        result = true;
      }
    });
    return result;
  }

  public reset(): void {
    this.fields.forEach((value, key) => {
      if (value.isDirty) {
        value.reset();
      }
    });
  }
}
