import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './common/user.service';
import { NotificationService } from './notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public pendingNotifications = 0;
  public title = 'Thingzes';
  public userMessage: string;
  public loggedIn: boolean;

  constructor(
    private userService: UserService
    , private router: Router
    , private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notificationService.notificationCount.subscribe(count => this.pendingNotifications = count);
    this.userService.loginSubject.subscribe(userName => this.onLoggedIn(userName));
    this.userService.logoutSubject.subscribe(() => this.onLoggedOut());
    this.userService.notification.subscribe(data => {
      this.notificationService.push(data.message);
    });
    this.loggedIn = this.userService.isLoggedIn();
    if (this.loggedIn) { this.onLoggedIn(this.userService.getUserName()); } else { this.onLoggedOut(); }
  }

  public login() {
    const url = this.router.url;
    this.userService.redirectUrl = url;
    this.router.navigateByUrl('/login');
  }

  public logout() {
    this.userService.logout();
  }

  private onLoggedIn(userName): void {
    this.userMessage = `You are logged in as ${userName}`;
    this.loggedIn = true;
  }

  private onLoggedOut(): void {
    this.userMessage = 'You are not logged in';
    this.loggedIn = false;
    this.router.navigateByUrl('/');
  }
}
