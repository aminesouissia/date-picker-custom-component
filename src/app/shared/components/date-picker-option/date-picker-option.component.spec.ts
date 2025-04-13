import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerOptionComponent } from './date-picker-option.component';

describe('DatePickerOptionComponent', () => {
  let component: DatePickerOptionComponent;
  let fixture: ComponentFixture<DatePickerOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
