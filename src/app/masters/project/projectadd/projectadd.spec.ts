import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projectadd } from './projectadd';

describe('Projectadd', () => {
  let component: Projectadd;
  let fixture: ComponentFixture<Projectadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projectadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Projectadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
