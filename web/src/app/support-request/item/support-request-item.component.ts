import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { slideInDownAnimation } from '../../common/animations';

import { SupportRequestService } from '../services/support-request.service';
import { UserService } from '../../common/user.service';

import { SupportRequestModel } from '../models/support-request-model';

@Component({
  selector: 'app-support-request-item',
  templateUrl: './support-request-item.component.html',
  styleUrls: ['./support-request-item.component.css'],
  animations: [slideInDownAnimation]
})
export class SupportRequestItemComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';

  public supportRequest: SupportRequestModel;
  public title: string;

  constructor(
    private route: ActivatedRoute
    , private router: Router
    , private userService: UserService
    , private supportRequestService: SupportRequestService
  ) { }

  ngOnInit() {
    /*    this.route.data
          .subscribe((data: { model: SupportRequestModel }) => {
            this.title = data.model.title;
            this.supportRequest = data.model;
          });*/

    this.route.params.subscribe((params: Params) => {
      const id: number = +params['id'];
      this.supportRequestService.getSupportRequest(id).then(entity => {
        this.supportRequest = SupportRequestModel.mapFrom(entity, this.userService);
        this.title = this.supportRequest.title;
      });
    });
  }
}
