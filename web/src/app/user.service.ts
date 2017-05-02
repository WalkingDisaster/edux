import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
  private static USER_NAME_KEY = 'fddd6b1d-c754-4778-bbf4-b03554c3c48e';
  redirectUrl: string;
  public loginSubject = new Subject<string>();
  public logoutSubject = new Subject<void>();

  constructor() { }

  public getUserName(): string {
    return localStorage.getItem(UserService.USER_NAME_KEY)
  }

  public login(userName: string): void {
    localStorage.setItem(UserService.USER_NAME_KEY, userName);
    this.loginSubject.next(userName);
  }

  public logout(): void {
    localStorage.removeItem(UserService.USER_NAME_KEY);
    this.logoutSubject.next();
  }

  public isLoggedIn(): boolean {
    if (!localStorage.getItem(UserService.USER_NAME_KEY)) {
      return false;
    }
    return true;
  }
}
