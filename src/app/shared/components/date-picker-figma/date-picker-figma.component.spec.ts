import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerFigmaComponent } from './date-picker-figma.component';

describe('DatePickerFigmaComponent', () => {
  let component: DatePickerFigmaComponent;
  let fixture: ComponentFixture<DatePickerFigmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerFigmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerFigmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
