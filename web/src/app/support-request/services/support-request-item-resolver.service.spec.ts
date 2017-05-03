/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupportRequestItemResolverService } from './support-request-item-resolver.service';

describe('SupportRequestItemResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportRequestItemResolverService]
    });
  });

  it('should ...', inject([SupportRequestItemResolverService], (service: SupportRequestItemResolverService) => {
    expect(service).toBeTruthy();
  }));
});
