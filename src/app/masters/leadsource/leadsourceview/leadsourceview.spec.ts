import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leadsourceview } from './leadsourceview';

describe('Leadsourceview', () => {
  let component: Leadsourceview;
  let fixture: ComponentFixture<Leadsourceview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leadsourceview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leadsourceview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
