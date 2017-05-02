import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;

  constructor(
    private userService: UserService
    , private router: Router
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.userName = this.userService.getUserName();
    }
  }

  public onSubmit(): void {
    this.userService.login(this.userName);
    const redirectUrl = this.userService.redirectUrl;
    this.userService.redirectUrl = '';
    this.router.navigate([redirectUrl]);
  }

  public isNotValid(): boolean {
    return !this.userName;
  }
}
