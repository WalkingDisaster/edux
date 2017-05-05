import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SocketService } from './socket.service';
import { EventAggregatorService } from './event-aggregator.service';

import { NotificationDto } from '../dtos/notification-dto';
import { Notification } from '../models/notification';

import * as io from 'socket.io-client';

@Injectable()
export class UserService {
  private static USER_NAME_KEY = 'fddd6b1d-c754-4778-bbf4-b03554c3c48e';
  private static TOKEN = '477eb2ea-f191-4a9c-8116-11c40b5ab0dc';
  private socket: SocketIOClient.Socket;

  public redirectUrl: string;
  public notification = new Subject<Notification>();

  constructor(
    private eventAggregator: EventAggregatorService
    , private socketService: SocketService
  ) {
    this.initSocket(this.socketService.connect());
  }

  private initSocket(socket: SocketIOClient.Socket): void {
    this.subscribeEvents(socket);
    this.socket = socket;
  }

  private subscribeEvents(socket: SocketIOClient.Socket): void {
    socket
      .on('connect', () => {
        if (this.isLoggedIn()) {
          const userName = this.getUserName();
          this.socket.emit('login', {
            userName: userName,
            token: localStorage.getItem(UserService.TOKEN)
          });
        }
      })
      .on('token acquired', token => {
        localStorage.setItem(UserService.TOKEN, token);
      })
      .on('notify', (data: NotificationDto) => {
        this.notification.next(data);
      });
  }

  public getUserName(): string {
    return localStorage.getItem(UserService.USER_NAME_KEY);
  }

  public login(userName: string): void {
    localStorage.setItem(UserService.USER_NAME_KEY, userName);
    const token = localStorage.getItem(UserService.TOKEN);
    this.socket.emit('login', {
      userName: userName,
      token: token
    });
    this.eventAggregator.onLogin(userName);
  }

  public logout(): void {
    const userName = localStorage.getItem(UserService.USER_NAME_KEY);
    localStorage.removeItem(UserService.USER_NAME_KEY);
    this.eventAggregator.onLoggingOut(userName);
    this.socket.emit('logout');
  }

  public isLoggedIn(): boolean {
    if (!localStorage.getItem(UserService.USER_NAME_KEY)) {
      return false;
    }
    return true;
  }
}
