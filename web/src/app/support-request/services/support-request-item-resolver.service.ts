import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { SupportRequestService } from './support-request.service';
import { UserService } from '../../common/user.service';

import { SupportRequestModel } from '../models/support-request-model';

@Injectable()
export class SupportRequestItemResolverService implements Resolve<SupportRequestModel> {
  constructor(
    private userService: UserService
    , private supportRequestService: SupportRequestService
    , private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SupportRequestModel> {
    const id = route.params['id'];

    return this.supportRequestService.getSupportRequest(id).then(entity => {
      if (entity) {
        return SupportRequestModel.mapFrom(entity, this.userService);
      } else { // id not found
        this.router.navigate(['/support']);
        return null;
      }
    });
  }
}
