import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadsourcelist } from './leadsourcelist';

describe('Leadsourcelist', () => {
  let component: Leadsourcelist;
  let fixture: ComponentFixture<Leadsourcelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadsourcelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadsourcelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
