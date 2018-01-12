import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

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
    , private notificationBarService: ToastrService
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
      this.notificationBarService.warning(`You must be logged in to do the long running thing.`);
      return;
    }
    this.socketService.connect('').emit('run long running report');
  }
}
