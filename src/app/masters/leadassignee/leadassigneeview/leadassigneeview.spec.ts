import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadassigneeview } from './leadassigneeview';

describe('Leadassigneeview', () => {
  let component: Leadassigneeview;
  let fixture: ComponentFixture<Leadassigneeview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadassigneeview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadassigneeview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
