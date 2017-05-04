import { TestBed, inject } from '@angular/core/testing';

import { EventAggregatorService } from './event-aggregator.service';

describe('EventAggregatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAggregatorService]
    });
  });

  it('should ...', inject([EventAggregatorService], (service: EventAggregatorService) => {
    expect(service).toBeTruthy();
  }));
});
