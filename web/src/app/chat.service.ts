import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChatMessage } from './models/chat-message';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket = io('http://localhost:3000');
  }
  /*
    public send(message: Message): void {
      this.socket.emit('message', message);
    }
  */
  public getMessageObserver(): Observable<ChatMessage> {
    const observable = new Observable(observer => {
      this.socket.on('new message', (data) => {
        observer.next(new ChatMessage(data.username, data.message));
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  public iAm(name: String): Observable<Array<string>> {
    this.socket.emit('add user', name);
    return new Observable(observer => {
      this.socket.on('login', (data) => {
        observer.next(data.users);
      });
    });
  }

  public imOuttaHere() {
    this.socket.emit('disconnect');
  }

  public getFunk() {
    return 'I am tha funk!';
  }
}
