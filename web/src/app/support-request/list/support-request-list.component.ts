import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { SupportRequest } from '../entities/support-request';
import { SupportRequestModel } from '../models/support-request-model';

import { SoftLockFieldService } from '../../common/soft-lock-field.service';
import { UserService } from '../../common/user.service';
import { SupportRequestService } from '../services/support-request.service';

@Component({
  selector: 'app-support-request-list',
  templateUrl: './support-request-list.component.html',
  styleUrls: ['./support-request-list.component.css']
})
export class SupportRequestListComponent implements OnInit {

  public supportRequests: Array<SupportRequestModel>;
  public currentItem: number;

  constructor(
    private lockService: SoftLockFieldService
    , private userService: UserService
    , private supportRequestService: SupportRequestService
    , private route: ActivatedRoute
    , private router: Router
  ) { }

  ngOnInit() {
    this.supportRequests = new Array<SupportRequestModel>();
    this.supportRequestService
      .supportRequestEntities
      .map<SupportRequest, SupportRequestModel>(entity => new SupportRequestModel(this.lockService, this.userService, entity))
      .subscribe(m => this.supportRequests.push(m));
    this.supportRequestService.requestUpdate();
  }

  public onSelect(supportRequest: SupportRequestModel): void {
    this.currentItem = supportRequest.id;
    this.router.navigate([supportRequest.id], { relativeTo: this.route });
  }

  public isSelected(supportRequest: SupportRequestModel): boolean {
    return this.currentItem === supportRequest.id;
  }
}
