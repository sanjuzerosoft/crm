import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadassigneeadd } from './leadassigneeadd';

describe('Leadassigneeadd', () => {
  let component: Leadassigneeadd;
  let fixture: ComponentFixture<Leadassigneeadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadassigneeadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadassigneeadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
