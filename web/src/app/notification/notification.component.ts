import { Component, OnInit } from '@angular/core';

import { NotificationService } from './notification.service';

import { Notification } from '../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: Array<Notification>;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notifications = this.notificationService.getNofications();
    this.notificationService.moreNotifications.subscribe(notification => {
      this.notifications.push(notification);
    });
  }

  public clearAllNotifications(): void {
    this.notificationService.push(new Notification('Notifications cleared.'));
    this.notificationService.clear();
    this.notifications = this.notificationService.getNofications();
  }
}
