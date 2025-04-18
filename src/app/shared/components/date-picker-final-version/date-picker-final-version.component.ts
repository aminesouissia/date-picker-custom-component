import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { HolidayService, Holiday } from '../../services/holiday.service';
import { Subject, takeUntil } from 'rxjs';

interface DateRange {
  startTime: string;
  endTime: string;
}

interface CalendarState {
  isOpen: boolean;
  showInfoMessage: boolean;
  enabledWeekdays: boolean[];
  enableHolidays: boolean;
  selectedDays: Date[];
  currentDate: Date;
  isDragging: boolean;
  selectionStart: Date | null;
}

export interface DatePickerConfig {
  defaultTimeRange?: DateRange;
  enableWeekends?: boolean;
  enableHolidays?: boolean;
  minDate?: Date;
  maxDate?: Date;
  holidayZone?: string;
}

enum WeekDay {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

@Component({
  selector: 'app-date-picker-final-version',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-final-version.component.html',
  styleUrl: './date-picker-final-version.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerFinalVersionComponent),
      multi: true,
    },
  ],
})
export class DatePickerFinalVersionComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() config: DatePickerConfig = {};
  @Output() selectedDatesChange = new EventEmitter<Date[]>();
  @Output() timeRangeChange = new EventEmitter<DateRange>();

  private destroy$ = new Subject<void>();
  private holidays: Holiday[] = [];
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  readonly weekdays = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];

  readonly months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  state: CalendarState = {
    isOpen: false,
    showInfoMessage: false,
    enabledWeekdays: [true, true, true, true, true, true, true],
    enableHolidays: false,
    selectedDays: [],
    currentDate: new Date(),
    isDragging: false,
    selectionStart: null,
  };

  timeRange: DateRange = {
    startTime: '09:00',
    endTime: '17:00',
  };

  constructor(
    private themeService: ThemeService,
    private holidayService: HolidayService
  ) {}

  ngOnInit() {
    this.themeService.resetTheme();
    this.initializeConfig();
    this.loadHolidays();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date[]): void {
    if (Array.isArray(value)) {
      this.state.selectedDays = value.map((date) => new Date(date));
      this.selectedDatesChange.emit(this.state.selectedDays);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if needed
  }

  private initializeConfig(): void {
    if (this.config.defaultTimeRange) {
      this.timeRange = { ...this.config.defaultTimeRange };
    }

    if (typeof this.config.enableWeekends === 'boolean') {
      this.state.enabledWeekdays[5] = this.config.enableWeekends; // Saturday
      this.state.enabledWeekdays[6] = this.config.enableWeekends; // Sunday
    }

    if (typeof this.config.enableHolidays === 'boolean') {
      this.state.enableHolidays = this.config.enableHolidays;
    }
  }

  private loadHolidays(): void {
    const currentYear = this.state.currentDate.getFullYear();
    this.holidayService
      .getHolidays(currentYear, this.config.holidayZone)
      .pipe(takeUntil(this.destroy$))
      .subscribe((holidays) => {
        this.holidays = holidays;
      });
  }

  // Event Handlers
  @HostListener('window:mouseup')
  onWindowMouseUp() {
    this.endDaySelection();
  }

  // Calendar UI Actions
  toggleCalendar(): void {
    if (this.state.isOpen) {
      this.reset();
    }
    this.state.isOpen = !this.state.isOpen;
    this.state.showInfoMessage = !this.state.showInfoMessage;
  }

  closeCalendar(): void {
    this.reset();
    this.state.isOpen = false;
    this.state.showInfoMessage = false;
  }

  closeInfoMessage(): void {
    this.state.showInfoMessage = false;
  }

  // Navigation
  previousYear(): void {
    this.state.currentDate = new Date(
      this.state.currentDate.getFullYear() - 1,
      0,
      1
    );
    this.loadHolidays();
  }

  nextYear(): void {
    this.state.currentDate = new Date(
      this.state.currentDate.getFullYear() + 1,
      0,
      1
    );
    this.loadHolidays();
  }

  // Settings
  toggleWeekday(index: number): void {
    this.state.enabledWeekdays[index] = !this.state.enabledWeekdays[index];
    this.state.selectedDays = this.state.selectedDays.filter((day) =>
      this.isEnabled(day)
    );
    this.emitChanges();
  }

  updateHolidaySettings(): void {
    if (!this.state.enableHolidays) {
      this.state.selectedDays = this.state.selectedDays.filter(
        (day) => !this.isHoliday(day)
      );
      this.emitChanges();
    }
  }

  updateTimeRange(): void {
    this.timeRangeChange.emit(this.timeRange);
  }

  reset(): void {
    this.state.selectedDays = [];
    this.timeRange = {
      startTime: '09:00',
      endTime: '17:00',
    };
    this.state.enableHolidays = false;
    this.state.enabledWeekdays = [true, true, true, true, true, true, true];
    this.initializeConfig();
    this.emitChanges();
  }

  // Helper Methods
  private emitChanges(): void {
    this.onChange(this.state.selectedDays);
    this.onTouched();
    this.selectedDatesChange.emit(this.state.selectedDays);
  }

  isHoliday(date: Date): boolean {
    return this.holidays.some(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth() &&
        holiday.date.getFullYear() === date.getFullYear()
    );
  }

  // Date Selection Methods
  startDaySelection(event: MouseEvent, date: Date): void {
    if (!this.isEnabled(date)) return;
    this.state.isDragging = true;
    this.state.selectionStart = date;
    this.selectDay(date);
  }

  dragSelectDay(event: MouseEvent, date: Date): void {
    if (!this.state.isDragging || !this.state.selectionStart) return;
    this.selectDaysInRange(this.state.selectionStart, date);
  }

  endDaySelection(): void {
    this.state.isDragging = false;
    this.state.selectionStart = null;
  }

  selectDaysInRange(start: Date, end: Date): void {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const minTime = Math.min(startTime, endTime);
    const maxTime = Math.max(startTime, endTime);

    this.state.selectedDays = this.state.selectedDays.filter(
      (date) => date.getTime() < minTime || date.getTime() > maxTime
    );

    const currentDate = new Date(minTime);
    while (currentDate.getTime() <= maxTime) {
      if (this.isEnabled(currentDate)) {
        this.state.selectedDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  selectDay(date: Date): void {
    if (!this.isEnabled(date)) return;

    const index = this.state.selectedDays.findIndex(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );

    if (index === -1) {
      this.state.selectedDays.push(new Date(date));
    } else {
      this.state.selectedDays.splice(index, 1);
    }
  }

  // Year Selection Methods
  toggleYearSelection(): void {
    const year = this.state.currentDate.getFullYear();
    const isYearSelected = this.isYearSelected();

    if (isYearSelected) {
      this.state.selectedDays = this.state.selectedDays.filter(
        (date) => date.getFullYear() !== year
      );
    } else {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (this.isEnabled(currentDate)) {
          this.state.selectedDays.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  // Week Selection Methods
  toggleWeekSelection(week: Date[]): void {
    const isWeekSelected = this.isWeekSelected(week);

    if (isWeekSelected) {
      week.forEach((day) => {
        const index = this.state.selectedDays.findIndex(
          (selectedDate) =>
            selectedDate.getDate() === day.getDate() &&
            selectedDate.getMonth() === day.getMonth() &&
            selectedDate.getFullYear() === day.getFullYear()
        );
        if (index !== -1) {
          this.state.selectedDays.splice(index, 1);
        }
      });
    } else {
      week.forEach((day) => {
        if (this.isEnabled(day) && !this.isSelected(day)) {
          this.state.selectedDays.push(new Date(day));
        }
      });
    }
  }

  // Helper Methods
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === WeekDay.Sunday || day === WeekDay.Saturday;
  }

  isEnabled(date: Date): boolean {
    if (!this.state.enableHolidays && this.isHoliday(date)) return false;
    const dayIndex = (date.getDay() + 6) % 7;
    return this.state.enabledWeekdays[dayIndex];
  }

  isSelected(date: Date): boolean {
    return this.state.selectedDays.some(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );
  }

  isWeekSelected(week: Date[]): boolean {
    return week.every((day) => this.isSelected(day) || !this.isEnabled(day));
  }

  isYearSelected(): boolean {
    const year = this.state.currentDate.getFullYear();
    const allDaysInYear = this.getAllEnabledDaysInYear(year);
    return allDaysInYear.every((date) =>
      this.state.selectedDays.some(
        (selectedDate) =>
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear()
      )
    );
  }

  // Calendar Grid Methods
  getWeeksInMonth(monthIndex: number): Date[][] {
    const days = this.getDaysInMonth(monthIndex);
    const weeks: Date[][] = [];
    let week: Date[] = [];

    days.forEach((day, index) => {
      week.push(day);
      if ((index + 1) % 7 === 0) {
        weeks.push(week);
        week = [];
      }
    });

    return weeks;
  }

  getDaysInMonth(monthIndex: number): Date[] {
    const year = this.state.currentDate.getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days: Date[] = [];

    let firstDayOfWeek = firstDay.getDay() || 7;
    firstDayOfWeek = firstDayOfWeek === 1 ? 8 : firstDayOfWeek;

    for (let i = 1; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, monthIndex, 1 - i);
      days.unshift(prevDate);
    }

    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, monthIndex + 1, i);
      days.push(nextDate);
    }

    return days;
  }

  getWeekNumber(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
    const firstWeek = new Date(target.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((target.getTime() - firstWeek.getTime()) / 86400000 -
          3 +
          ((firstWeek.getDay() + 6) % 7)) /
          7
      )
    );
  }

  private getAllEnabledDaysInYear(year: number): Date[] {
    const days: Date[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (this.isEnabled(currentDate)) {
        days.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }

  // Final Actions
  validate(): void {
    this.emitChanges();
    this.state.isOpen = false;
    this.state.showInfoMessage = false;
     console.log('Dates sélectionnées:', this.state.selectedDays);
     console.log('Plage horaire:', {
       début: this.timeRange.startTime,
       fin: this.timeRange.endTime,
     });
  }
}
