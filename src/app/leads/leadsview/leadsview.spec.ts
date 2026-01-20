import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadsview } from './leadsview';

describe('Leadsview', () => {
  let component: Leadsview;
  let fixture: ComponentFixture<Leadsview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadsview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadsview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
