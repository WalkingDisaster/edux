import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class EventAggregatorService {

  private userLogout = new Subject<string>();
  private userLogin = new Subject<string>();

  constructor() { }

  get userLogingOutEvent(): Observable<string> {
    return this.userLogout;
  }
  get userLoginEvents(): Observable<string> {
    return this.userLogin;
  }

  public onLoggingOut(userName: string): void {
    this.userLogout.next(userName);
  }

  public onLogin(userName: string): void {
    this.userLogin.next(userName);
  }
}
