import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projectlist } from './projectlist';

describe('Projectlist', () => {
  let component: Projectlist;
  let fixture: ComponentFixture<Projectlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projectlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Projectlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
