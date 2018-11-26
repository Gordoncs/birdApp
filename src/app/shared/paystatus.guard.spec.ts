import { TestBed, async, inject } from '@angular/core/testing';

import { PaystatusGuard } from './paystatus.guard';

describe('PaystatusGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaystatusGuard]
    });
  });

  it('should ...', inject([PaystatusGuard], (guard: PaystatusGuard) => {
    expect(guard).toBeTruthy();
  }));
});
