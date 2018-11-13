import { TestBed } from '@angular/core/testing';

import { TongxinService } from './tongxin.service';

describe('TongxinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TongxinService = TestBed.get(TongxinService);
    expect(service).toBeTruthy();
  });
});
