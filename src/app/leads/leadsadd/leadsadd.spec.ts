import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadsadd } from './leadsadd';

describe('Leadsadd', () => {
  let component: Leadsadd;
  let fixture: ComponentFixture<Leadsadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadsadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadsadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
