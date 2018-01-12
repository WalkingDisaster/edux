import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ToastrService } from 'ngx-toastr';
import { Notification } from '../models/notification';

@Injectable()
export class NotificationService {

  private notifications: Array<Notification>;

  public notificationCount: Subject<number>;
  public moreNotifications: Subject<Notification>;

  constructor(private notificationBarService: ToastrService) {
    this.notificationCount = new Subject<number>();
    this.moreNotifications = new Subject<Notification>();
    this.notifications = new Array<Notification>();
  }

  public push(notification: Notification): void {
    this.notifications.push(notification);
    this.notificationBarService.info(notification.message);
    this.notificationCount.next(this.notifications.length);
    this.moreNotifications.next(notification);
  }

  public clear(): void {
    this.notifications = new Array<Notification>();
    this.notificationCount.next(0);
  }

  public getNofications(): Array<Notification> {
    return Array.from(this.notifications);
  }
}
