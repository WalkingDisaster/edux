/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupportRequestService } from './support-request.service';

describe('SupportRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportRequestService]
    });
  });

  it('should ...', inject([SupportRequestService], (service: SupportRequestService) => {
    expect(service).toBeTruthy();
  }));
});
