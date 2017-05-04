import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

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
      this.supportRequestService.getSupportRequest(id).then(entity => {
        this.supportRequest = new SupportRequestModel(this.lockService, this.userService, entity);
      });
    });
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

  public createNew(): void {
    this.supportRequestService.createNew()
      .then(newItem => {

      });
  }
}
