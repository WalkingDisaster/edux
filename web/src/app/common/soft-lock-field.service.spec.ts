/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SoftLockFieldService } from './soft-lock-field.service';

describe('SoftLockFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoftLockFieldService]
    });
  });

  it('should ...', inject([SoftLockFieldService], (service: SoftLockFieldService) => {
    expect(service).toBeTruthy();
  }));
});
