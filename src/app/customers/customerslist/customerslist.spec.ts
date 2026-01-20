import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customerslist } from './customerslist';

describe('Customerslist', () => {
  let component: Customerslist;
  let fixture: ComponentFixture<Customerslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customerslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customerslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
