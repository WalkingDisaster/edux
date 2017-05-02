import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private static BASE_NAMESPACE = 'http://localhost:3000';
  private sockets: Map<string, SocketIOClient.Socket>;

  constructor() {
    this.sockets = new Map<string, SocketIOClient.Socket>();
    this.sockets.set('', io(SocketService.BASE_NAMESPACE));
  }

  public connect(namespace?: string): SocketIOClient.Socket {
    if (!namespace || namespace.trim() === '') {
      return this.sockets.get('');
    }

    if (!this.sockets.has(namespace)) {
      const nsp = `${SocketService.BASE_NAMESPACE}/${namespace}`;
      this.sockets.set(namespace, io(nsp));
    }
    return this.sockets.get(namespace);
  }
}
