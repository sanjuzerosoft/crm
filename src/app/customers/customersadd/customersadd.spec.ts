import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customersadd } from './customersadd';

describe('Customersadd', () => {
  let component: Customersadd;
  let fixture: ComponentFixture<Customersadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customersadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customersadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
