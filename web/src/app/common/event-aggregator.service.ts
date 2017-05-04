import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class EventAggregatorService {

  private userLogout = new Subject<void>();
  private userLogin = new Subject<string>();

  constructor() { }

  get userLogoutEvents(): Observable<void> {
    return this.userLogout;
  }
  get userLoginEvents(): Observable<string> {
    return this.userLogin;
  }

  public onLogout(): void {
    this.userLogout.next();
  }

  public onLogin(userName: string): void {
    this.userLogin.next(userName);
  }
}
