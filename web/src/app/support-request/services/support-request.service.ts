import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SupportRequest, SupportRequestStateHistoryItem } from '../entities/support-request';
import { SocketService } from '../../common/socket.service';

@Injectable()
export class SupportRequestService {

  private socket: SocketIOClient.Socket;
  private supportRequestSubject = new Subject<SupportRequest>();

  constructor(private socketService: SocketService) {
    this.socket = socketService.connect('support');
    this.socket.on('nextItem', (data: SupportRequest) => {
      this.supportRequestSubject.next(data);
    });
  }

  public requestUpdate() {
    this.socket.emit('get', { id: null });
  }

  public getSupportRequest(id: number): Promise<SupportRequest> {
    return new Promise((resolve, reject) => {
      this.socket.on('get-one-' + id, (data: SupportRequest) => {
        resolve(data);
      })
      this.socket.emit('get-one', { id: id });
    });
  }

  get supportRequestEntities(): Observable<SupportRequest> {
    return this.supportRequestSubject;
  }
}
