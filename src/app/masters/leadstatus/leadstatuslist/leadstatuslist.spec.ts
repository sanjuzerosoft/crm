import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadstatuslist } from './leadstatuslist';

describe('Leadstatuslist', () => {
  let component: Leadstatuslist;
  let fixture: ComponentFixture<Leadstatuslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadstatuslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadstatuslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
