import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activityadd } from './activityadd';

describe('Activityadd', () => {
  let component: Activityadd;
  let fixture: ComponentFixture<Activityadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activityadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activityadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
