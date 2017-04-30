import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { UserDto } from './dtos/user-dto';
import { ChatMessageDto } from './dtos/chat-message-dto';

import { UserChangeEvent, UserChangeType } from './events/user-change-event';
import { MessageEvent } from './events/message-event';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  private isTyping = false;
  private socket: SocketIOClient.Socket;
  private currentUser: string;

  userSubject: Subject<UserChangeEvent>;
  users: Set<string>;

  messageSubject: Subject<MessageEvent>;

  constructor() {
    this.users = new Set<string>();
    this.userSubject = new Subject<UserChangeEvent>();
    this.messageSubject = new Subject<MessageEvent>();

    this.initSocket();
  }

  private initSocket(): void {
    const socket = io('http://localhost:3000/chat');
    this.subscribeEvents(socket);
    this.socket = socket;
  }
  private subscribeEvents(socket: SocketIOClient.Socket): void {
    socket
      .on('login', users => this.replaceUsers(users))
      .on('user joined', user => this.addUser(user))
      .on('user left', user => this.removeUser(user))
      .on('new message', message => this.messageReceived(message))
      .on('typing', user => this.userIsTyping(user))
      .on('stop typing', user => this.userStoppedTyping(user));
  }

  private replaceUsers(data: any): void {
    const currentUsers = Array.from(this.users);
    for (let i = 0; i < currentUsers.length; i++) {
      const currentUser = currentUsers[i];
      this.removeUser(new UserDto(currentUser));
    }

    for (const user of data.users) {
      this.addUser(new UserDto(user));
    }
    console.log(this.users);
  }

  private addUser(userDto: UserDto): void {
    if (this.users.has(userDto.userName)) {
      return;
    }
    this.users.add(userDto.userName);
    this.userSubject.next(new UserChangeEvent(userDto.userName, UserChangeType.Joined));
  }

  private removeUser(userDto: UserDto): void {
    if (this.users.has(userDto.userName)) {
      this.users.delete(userDto.userName);
      this.userSubject.next(new UserChangeEvent(userDto.userName, UserChangeType.Left));
    }
  }

  private messageReceived(messageDto: ChatMessageDto): void {
    this.messageSubject.next(new MessageEvent(messageDto.userName, messageDto.message));
  }

  private userIsTyping(user: UserDto): void {
    this.userSubject.next(new UserChangeEvent(user.userName, UserChangeType.Typing));
  }

  private userStoppedTyping(user: UserDto): void {
    this.userSubject.next(new UserChangeEvent(user.userName, UserChangeType.StoppedTyping));
  }

  public connectAs(userName: string): void {
    if (this.currentUser === userName) {
      return;
    }
    this.currentUser = userName;
    this.socket.emit('add user', userName);
  }

  public disconnect(): void {
    this.currentUser = null;
    this.socket.disconnect();
  }

  public sendMessage(message: string): void {
    this.messageSubject.next(new MessageEvent(this.currentUser, message));
    this.socket.emit('new message', message);
  }

  public typing(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.socket.emit('typing');
    }
  }

  public stopTyping(): void {
    if (this.isTyping) {
      this.isTyping = false;
      this.socket.emit('stop typing');
    }
  }
}
