import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadsourceadd } from './leadsourceadd';

describe('Leadsourceadd', () => {
  let component: Leadsourceadd;
  let fixture: ComponentFixture<Leadsourceadd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadsourceadd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadsourceadd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
