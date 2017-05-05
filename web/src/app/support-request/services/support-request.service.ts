import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SupportRequestDto } from '../dtos/support-request-dto';
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
    this.eventAggregator.userLogingOutEvent.forEach(userName => {
      this.models = new Array<SupportRequestModel>();
      this.stopViewing(null, userName);
    });
    this.socket = socketService.connect('support');
    this.socket.on('nextItem', (data: SupportRequestDto) => {
      this.addModel(data);
    });
    this.socket.on('view-start', (data) => {
      const id = data.id;
      const userName = data.userName;
      const found = this.models.find(model => model.id === id);
      if (!found || found.viewers.has(userName)) {
        return;
      }
      found.viewers.add(userName);
    });
    this.socket.on('view-end', (data) => {
      const id = data.id;
      const userName = data.userName;
      const found = this.models.find(model => model.id === id);
      if (!found || !found.viewers.has(userName)) {
        return;
      }
      found.viewers.delete(userName);
    });
    this.socket.on('locked', data => {
      const id = data.id;
      const userName = data.userName;
      const found = this.models
        .find(model => model.id === id);
      if (!found) {
        return;
      }
      found.locked = true;
      found.lockedBy = userName;
    });
    this.socket.on('unlocked', data => {
      const id = data.id;
      const found = this.models.find(model => model.id === id);
      if (!found) {
        return;
      }
      found.locked = false;
      found.lockedBy = null;
    });
  }

  public requestUpdate() {
    this.models = new Array<SupportRequestModel>();
    this.socket.emit('get', { id: null });
  }

  public startViewing(model: SupportRequestModel): void {
    const userName = this.userService.getUserName();
    this.socket.emit('viewing', {
      id: model.id,
      userName: userName
    });
  }

  public stopViewing(id: number, userName: string): void {
    this.socket.emit('stopped viewing', {
      id: id,
      userName: userName
    });
  }

  public lockRecord(model: SupportRequestModel): void {
    this.socket.emit('lock', { id: model.id, userName: this.userService.getUserName() });
  }

  public unlockRecord(model: SupportRequestModel): void {
    this.socket.emit('unlock', { id: model.id });
  }

  public getSupportRequest(id: number): Promise<SupportRequestModel> {
    return new Promise((resolve, reject) => {
      const result = this.models.find(other => other.id === id);
      if (!result) {
        this.socket.emit('find', { id: id }, (data: SupportRequestDto) => {
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

  private addModel(dto: SupportRequestDto): SupportRequestModel {
    const entity = dto.item;
    const existing = this.models.find(m => m.id === entity.id);
    if (!existing) {
      const model = new SupportRequestModel(
        this.lockService,
        this.userService,
        entity,
        new Set<string>(dto.viewers),
        dto.locked,
        dto.lockedBy);
      this.models.push(model);
      this.supportRequestSubject.next(model);
      return model;
    }
    return existing;
  }
}
