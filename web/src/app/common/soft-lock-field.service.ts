import { Injectable } from '@angular/core';

import { UtilityService } from '../common/utility.service';
import { SocketService } from '../common/socket.service';
import { UserService } from '../common/user.service';
import { EventAggregatorService } from '../common/event-aggregator.service';

import { FieldWrapper } from './field-wrapper';
import { ListWrapper } from './list-wrapper';
import { WrappedItem } from './wrapped-item';

@Injectable()
export class SoftLockFieldService {
  private userName: string;
  private socket: SocketIOClient.Socket;

  constructor(
    private eventAggregator: EventAggregatorService
    , private userService: UserService
    , private utilityService: UtilityService
    , private socketService: SocketService
  ) {
    this.eventAggregator.userLoginEvents.forEach(userName => this.userName = userName);
    this.userName = userService.getUserName();
  }

  public manage(id: number): SoftLockFieldManager {
    return new SoftLockFieldManager(this.utilityService, this.socketService.connect('support'), id, this.userName);
  }
}

export class SoftLockFieldManager {
  private items = new Map<string, WrappedItem>();

  constructor(
    private utilityService: UtilityService
    , private socket: SocketIOClient.Socket
    , private id: number
    , private userName: string
  ) { }

  public wrapField<T>(name: string, accessor: () => T, mutator: (T) => void): FieldWrapper<T> {
    const newField = new FieldWrapper<T>(this.utilityService, this.socket, this.id, this.userName, name, accessor, mutator);
    this.items.set(name, newField);
    return newField;
  }

  public wrapList<T>(name: string, accessor: () => Array<T>, add: (T) => void): ListWrapper<T> {
    const newList = new ListWrapper<T>(name, accessor, add);
    this.items.set(name, newList);
    return newList;
  }

  public get isDirty(): boolean {
    let result: boolean;
    this.items.forEach((value, key) => {
      if (value.isDirty) {
        result = true;
      }
    });
    return result;
  }

  public reset(): void {
    this.items.forEach((value, key) => {
      if (value.isDirty) {
        value.reset();
      }
    });
  }
}
