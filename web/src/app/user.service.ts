import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  private static userName: string;
  redirectUrl: string;

  constructor() { }

  public getUserName() {
    return UserService.userName;
  }

  public setUserName(userName: string) {
    UserService.userName = userName;
  }

  public userNameIsSet(): boolean {
    return !(!UserService.userName);
  }
}
