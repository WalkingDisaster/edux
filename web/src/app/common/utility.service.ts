import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilityService {

  private subjects = new Map<Debouncable, Subject<void>>();

  constructor() { }


  public debounce(target: Debouncable, timeout: number): Observable<void> {
    if (!this.subjects.has(target)) {
      this.subjects.set(target, new Subject<void>());
    }
    const subject = this.subjects.get(target);


    if (target.timeoutId) {
      window.clearTimeout(target.timeoutId);
    }

    target.timeoutId = window.setTimeout(() => {
      subject.next();
    }, timeout);
    return subject;
  }

  public sort(a: string, b: string): number {
    if (a === null) {
      a = '';
    }
    if (b === null) {
      b = '';
    }
    const A = a.toLowerCase();
    const B = b.toLowerCase();
    if (A === B) {
      return 0;
    }
    if (A < B) {
      return -1;
    }
    return 1;
  }
}

export interface Debouncable {
  timeoutId: number;
}