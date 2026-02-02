import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activitylist } from './activitylist';

describe('Activitylist', () => {
  let component: Activitylist;
  let fixture: ComponentFixture<Activitylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activitylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Activitylist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
