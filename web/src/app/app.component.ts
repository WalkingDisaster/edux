import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/primeng';

import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Thingzes';
  userMessage: string;
  loggedIn: boolean;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.loginSubject.subscribe(userName => this.onLoggedIn(userName));
    this.userService.logoutSubject.subscribe(() => this.onLoggedOut());
    this.userService.notification.subscribe(data => {
      alert(data.message);
    }); // finish
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
