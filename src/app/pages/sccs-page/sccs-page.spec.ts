import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SccsPage } from './sccs-page';

describe('SccsPage', () => {
  let component: SccsPage;
  let fixture: ComponentFixture<SccsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SccsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SccsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
