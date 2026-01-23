import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadstatusadd } from './leadstatusadd';

describe('Leadstatusadd', () => {
  let component: Leadstatusadd;
  let fixture: ComponentFixture<Leadstatusadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadstatusadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadstatusadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
