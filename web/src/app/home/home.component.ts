import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationBarService, NotificationType } from 'angular2-notification-bar';

import { UserService } from '../common/user.service';
import { SocketService } from '../common/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService
    , private notificationBarService: NotificationBarService
    , private socketService: SocketService
    , private router: Router
  ) { }

  ngOnInit() {
  }

  public routeToChat(): void {
    this.router.navigateByUrl('/chat');
  }

  public doSomethingThatTakesALongTime(): void {
    if (!this.userService.isLoggedIn()) {
      this.notificationBarService.create({
        message: `You must be logged in to do the long running thing.`,
        type: NotificationType.Warning
      });
      return;
    }
    this.socketService.connect('').emit('run long running report');
  }
}
