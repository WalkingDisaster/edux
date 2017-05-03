import { Injectable } from '@angular/core';

import { NotificationBarService, NotificationType } from 'angular2-notification-bar';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotificationService {

  private notifications: Array<string>;

  public notificationCount: Subject<number>;
  public moreNotifications: Subject<string>;

  constructor(private notificationBarService: NotificationBarService) {
    this.notificationCount = new Subject<number>();
    this.moreNotifications = new Subject<string>();
    this.notifications = new Array<string>();
  }

  public push(notification: string): void {
    this.notifications.push(notification);
    this.notificationBarService.create({ message: notification, type: NotificationType.Info });
    this.notificationCount.next(this.notifications.length);
    this.moreNotifications.next(notification);
  }

  public clear(): void {
    this.notifications = new Array<string>();
    this.notificationCount.next(0);
  }

  public getNofications(): Array<string> {
    return Array.from(this.notifications);
  }
}
