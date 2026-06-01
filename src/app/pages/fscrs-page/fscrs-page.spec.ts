import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FscrsPage } from './fscrs-page';

describe('FscrsPage', () => {
  let component: FscrsPage;
  let fixture: ComponentFixture<FscrsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FscrsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FscrsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
