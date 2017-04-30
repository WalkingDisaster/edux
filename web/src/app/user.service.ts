import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  private static USER_NAME_KEY = 'fddd6b1d-c754-4778-bbf4-b03554c3c48e';
  redirectUrl: string;

  constructor() { }

  public getUserName() {
    return localStorage.getItem(UserService.USER_NAME_KEY)
  }

  public setUserName(userName: string) {
    localStorage.setItem(UserService.USER_NAME_KEY, userName);
  }

  public userNameIsSet(): boolean {
    return localStorage.getItem(UserService.USER_NAME_KEY) !== null;
  }
}
