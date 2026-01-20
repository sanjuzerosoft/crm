import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customersview } from './customersview';

describe('Customersview', () => {
  let component: Customersview;
  let fixture: ComponentFixture<Customersview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customersview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customersview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
