import { TestBed } from '@angular/core/testing';

import { MikeDbService } from './mike-db.service';

describe('MikeDbService', () => {
  let service: MikeDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MikeDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
