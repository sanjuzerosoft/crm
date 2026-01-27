import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Industrytypeadd } from './industrytypeadd';

describe('Industrytypeadd', () => {
  let component: Industrytypeadd;
  let fixture: ComponentFixture<Industrytypeadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Industrytypeadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Industrytypeadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
