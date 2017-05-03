import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SupportRequest, SupportRequestStateHistoryItem } from '../entities/support-request';

@Injectable()
export class SupportRequestService {

  private maxId = 0;
  private supportRequests: Array<SupportRequest>;

  constructor() {
    this.supportRequests = [
      this.CreateDummySupportRequest('First Request', 'First request details'),
      this.CreateDummySupportRequest('Second Request', 'Second request details')
    ];
  }

  private CreateDummySupportRequest(title: string, description: string): SupportRequest {
    const request = new SupportRequest();

    request.id = this.maxId++;
    request.recorded = new Date();
    request.recordedBy = 'WalkingDisaster';
    request.title = title;
    request.description = description;
    const historyItem = new SupportRequestStateHistoryItem(request.recorded, 'WalkingDisaster', 'Identified', null);
    request.changeHistory = [historyItem];

    return request;
  }

  public getSupportRequests(): Observable<SupportRequest> {
    return new Observable(sub => {
      for (const request of this.supportRequests) {
        sub.next(request);
      }
      sub.complete();
    });
  }

  public getSupportRequest(id: number | string): Promise<SupportRequest> {
    return new Promise((resolve, reject) => {
      resolve(this.supportRequests.find(request => request.id === +id));
    });
  }
}
