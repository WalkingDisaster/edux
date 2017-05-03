import { Component, OnInit } from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: Array<string>;

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
    this.notificationService.push('Notifications cleared.');
    this.notificationService.clear();
    this.notifications = this.notificationService.getNofications();
  }
}
