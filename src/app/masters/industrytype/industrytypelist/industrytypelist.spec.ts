import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Industrytypelist } from './industrytypelist';

describe('Industrytypelist', () => {
  let component: Industrytypelist;
  let fixture: ComponentFixture<Industrytypelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Industrytypelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Industrytypelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
