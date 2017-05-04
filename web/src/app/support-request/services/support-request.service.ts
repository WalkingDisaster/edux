import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SupportRequest } from '../entities/support-request';
import { SupportRequestModel } from '../models/support-request-model';

import { EventAggregatorService } from '../../common/event-aggregator.service';

import { SoftLockFieldService } from '../../common/soft-lock-field.service';
import { SocketService } from '../../common/socket.service';
import { UserService } from '../../common/user.service';

@Injectable()
export class SupportRequestService {

  private socket: SocketIOClient.Socket;
  private models = new Array<SupportRequestModel>();
  private supportRequestSubject = new Subject<SupportRequestModel>();

  constructor(
    private eventAggregator: EventAggregatorService
    , private lockService: SoftLockFieldService
    , private socketService: SocketService
    , private userService: UserService
  ) {
    this.eventAggregator.userLogoutEvents.forEach(() => this.models = new Array<SupportRequestModel>());
    this.socket = socketService.connect('support');
    this.socket.on('nextItem', (data: SupportRequest) => {
      this.addModel(data);
    });
  }

  public requestUpdate() {
    this.models = new Array<SupportRequestModel>();
    this.socket.emit('get', { id: null });
  }

  public getSupportRequest(id: number): Promise<SupportRequestModel> {
    return new Promise((resolve, reject) => {
      const result = this.models.find(other => other.id === id);
      if (!result) {
        this.socket.emit('find', { id: id }, (data: SupportRequest) => {
          const model = this.addModel(data);
          resolve(model);
        });
      } else {
        resolve(result);
      }
    });
  }

  get supportRequestModels(): Observable<SupportRequestModel> {
    return this.supportRequestSubject;
  }

  public createNew(): Promise<SupportRequestModel> {
    const currentUser = this.userService.getUserName();
    return new Promise<SupportRequestModel>(resolve => {
      const now = new Date();
      this.socket.emit('new', {
        userName: currentUser
      }, data => {
        const model = this.addModel(data);
        resolve(model);
      });
    });
  }

  private addModel(entity: SupportRequest): SupportRequestModel {
    const existing = this.models.find(m => m.id == entity.id);
    if (!existing) {
      const model = new SupportRequestModel(this.lockService, this.userService, entity);
      this.models.push(model);
      this.supportRequestSubject.next(model);
      return model;
    }
    return existing;
  }
}
