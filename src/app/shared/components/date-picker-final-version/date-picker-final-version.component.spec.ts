import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerFinalVersionComponent } from './date-picker-final-version.component';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

describe('DatePickerFinalVersionComponent', () => {
  let component: DatePickerFinalVersionComponent;
  let fixture: ComponentFixture<DatePickerFinalVersionComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerFinalVersionComponent, FormsModule],
      providers: [ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerFinalVersionComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle calendar visibility', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleCalendar();
    expect(component.isOpen).toBeTrue();
    component.toggleCalendar();
    expect(component.isOpen).toBeFalse();
  });

  it('should toggle weekday selection', () => {
    const index = 0;
    const initialState = component.enabledWeekdays[index];
    component.toggleWeekday(index);
    expect(component.enabledWeekdays[index]).toBe(!initialState);
  });

  it('should calculate correct week number', () => {
    const date = new Date(2024, 0, 1); // 1er janvier 2024
    const weekNumber = component.getWeekNumber(date);
    expect(weekNumber).toBe(1);
  });

  it('should navigate between years', () => {
    const initialYear = component.currentDate.getFullYear();
    component.nextYear();
    expect(component.currentDate.getFullYear()).toBe(initialYear + 1);
    component.previousYear();
    expect(component.currentDate.getFullYear()).toBe(initialYear);
  });

  it('should check if date is enabled', () => {
    const date = new Date();
    component.enabledWeekdays = [true, true, true, true, true, false, false];
    const dayIndex = (date.getDay() + 6) % 7;
    expect(component.isEnabled(date)).toBe(component.enabledWeekdays[dayIndex]);
  });

  it('should handle holiday dates', () => {
    component.enableHolidays = true;
    const holiday = new Date(2024, 0, 1); // Jour de l'An
    expect(component.isHoliday(holiday)).toBeTrue();
    const regularDay = new Date(2024, 0, 2);
    expect(component.isHoliday(regularDay)).toBeFalse();
  });

  it('should select and deselect dates', () => {
    const date = new Date();
    component.selectDay(date);
    expect(component.isSelected(date)).toBeTrue();
    component.selectDay(date);
    expect(component.isSelected(date)).toBeFalse();
  });

  it('should select date range', () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 3);
    component.selectDaysInRange(start, end);
    expect(component.selectedDays.length).toBe(2);
  });

  it('should handle time range updates', () => {
    const consoleSpy = spyOn(console, 'log');
    component.startTime = '09:00';
    component.endTime = '17:00';
    component.updateTimeRange();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Plage horaire mise à jour : 09:00 - 17:00'
    );
  });

  it('should validate selection', () => {
    const consoleSpy = spyOn(console, 'log');
    component.startTime = '09:00';
    component.endTime = '17:00';
    component.selectedDays = [new Date()];
    component.validate();
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(component.isOpen).toBeFalse();
  });

  it('should get correct days in month', () => {
    const monthIndex = 0; // Janvier
    const days = component.getDaysInMonth(monthIndex);
    expect(days.length).toBe(42); // 6 semaines * 7 jours
  });

  it('should get correct weeks in month', () => {
    const monthIndex = 0; // Janvier
    const weeks = component.getWeeksInMonth(monthIndex);
    expect(weeks.length).toBe(6); // 6 semaines
    weeks.forEach((week) => {
      expect(week.length).toBe(7); // 7 jours par semaine
    });
  });

  it('should toggle week selection', () => {
    const week = component.getWeeksInMonth(0)[0]; // Première semaine de janvier
    component.toggleWeekSelection(week);
    expect(
      week.every(
        (day) => component.isSelected(day) || !component.isEnabled(day)
      )
    ).toBeTrue();
    component.toggleWeekSelection(week);
    expect(week.every((day) => !component.isSelected(day))).toBeTrue();
  });

  it('should handle holiday settings update', () => {
    const holiday = new Date(2024, 0, 1); // Jour de l'An
    component.selectedDays = [holiday];
    component.enableHolidays = true;
    component.updateHolidaySettings();
    expect(component.selectedDays.length).toBe(1);
  });

  it('should handle mouse events for day selection', () => {
    const date = new Date();
    const event = new MouseEvent('mousedown');
    component.startDaySelection(event, date);
    expect(component.isDragging).toBeTrue();
    expect(component.selectionStart).toEqual(date);

    component.endDaySelection();
    expect(component.isDragging).toBeFalse();
    expect(component.selectionStart).toBeNull();
  });
});
