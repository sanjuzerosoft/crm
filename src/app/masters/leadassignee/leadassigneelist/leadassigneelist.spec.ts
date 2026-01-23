import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadassigneelist } from './leadassigneelist';

describe('Leadassigneelist', () => {
  let component: Leadassigneelist;
  let fixture: ComponentFixture<Leadassigneelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadassigneelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadassigneelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
