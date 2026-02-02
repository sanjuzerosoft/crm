import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activityview } from './activityview';

describe('Activityview', () => {
  let component: Activityview;
  let fixture: ComponentFixture<Activityview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activityview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activityview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
