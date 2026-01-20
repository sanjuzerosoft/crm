import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadslist } from './leadslist';

describe('Leadslist', () => {
  let component: Leadslist;
  let fixture: ComponentFixture<Leadslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
