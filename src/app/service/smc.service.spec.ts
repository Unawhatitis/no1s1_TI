import { TestBed } from '@angular/core/testing';

import { SMCService } from './smc.service';

describe('TransferService', () => {
  let service: SMCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
