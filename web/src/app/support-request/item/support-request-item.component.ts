import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationStart } from '@angular/router';

import { SoftLockFieldService } from '../../common/soft-lock-field.service';
import { SupportRequestService } from '../services/support-request.service';
import { UserService } from '../../common/user.service';

import { SupportRequestModel } from '../models/support-request-model';

@Component({
  selector: 'app-support-request-item',
  templateUrl: './support-request-item.component.html',
  styleUrls: ['./support-request-item.component.css']
})
export class SupportRequestItemComponent implements OnInit {
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';

  public supportRequest: SupportRequestModel;

  constructor(
    private route: ActivatedRoute
    , private router: Router
    , private lockService: SoftLockFieldService
    , private userService: UserService
    , private supportRequestService: SupportRequestService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id: number = +params['id'];
      this.supportRequestService.getSupportRequest(id).then(model => {
        this.supportRequestService.startViewing(model);
        this.supportRequest = model;
      });
    });
    this.router.events.forEach(event => {
      if (!this.supportRequest) {
        return;
      }
      if (event instanceof NavigationStart && event.url.substring(0, 9) === '/support/') {
        this.supportRequestService.unlockRecord(this.supportRequest);
        this.supportRequestService.stopViewing(this.supportRequest.id, this.userService.getUserName());
        this.supportRequest = null;
      }
    });
  }

  public lock(): void {
    this.supportRequestService.lockRecord(this.supportRequest);
  }

  get canLockCurrent(): boolean {
    if (!this.supportRequest) {
      return false;
    }
    return !this.supportRequest.locked;
  }

  get myLock(): boolean {
    if (!this.supportRequest || !this.supportRequest.locked) {
      return false;
    }
    return (this.supportRequest.lockedBy === this.userService.getUserName());
  }

  public unlock(): void {
    this.supportRequestService.unlockRecord(this.supportRequest);
  }

  public cancel(): void {
    this.supportRequest.reset();
  }

  get canSave(): boolean {
    return (this.supportRequest !== null && this.supportRequest.isDirty);
  }

  get isDirty(): boolean {
    return this.supportRequest.isDirty;
  }
}
