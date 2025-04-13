import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker-option',
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-option.component.html',
  styleUrl: './date-picker-option.component.scss',
})
export class DatePickerOptionComponent {
  isOpen = false;
  weekdays = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];
  months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novombre',
    'Decembre',
  ];
  enabledWeekdays = [true, true, true, true, true, true, true];
  currentDate = new Date();
  selectedDays: Date[] = [];
  isDragging = false;
  selectionStart: Date | null = null;
  isWeekSelection = false;
  tempSelectedDays: Date[] = [];

  @HostListener('window:mouseup')
  onWindowMouseUp() {
    if (this.isDragging) {
      this.selectedDays = [...this.tempSelectedDays];
    }
    this.isDragging = false;
    this.selectionStart = null;
    this.isWeekSelection = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  ngOnInit() {}

  toggleCalendar() {
    this.isOpen = !this.isOpen;
  }

  toggleWeekday(index: number) {
    this.enabledWeekdays[index] = !this.enabledWeekdays[index];
    this.selectedDays = this.selectedDays.filter((date) =>
      this.isEnabled(date)
    );
  }

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

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }

  getDaysInMonth(monthIndex: number): Date[] {
    const year = this.currentDate.getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days: Date[] = [];

    const firstDayOfWeek = firstDay.getDay() || 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
      const date = new Date(year, monthIndex, 1 - i);
      days.unshift(date);
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
      const date = new Date(year, monthIndex + 1, i);
      days.push(date);
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

  previousYear() {
    this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1);
    this.selectedDays = [];
  }

  nextYear() {
    this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
    this.selectedDays = [];
  }

  isEnabled(date: Date): boolean {
    const dayIndex = (date.getDay() + 6) % 7;
    return this.enabledWeekdays[dayIndex];
  }

  isSelected(date: Date): boolean {
    return (this.isDragging ? this.tempSelectedDays : this.selectedDays).some(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );
  }

  isWeekSelected(week: Date[]): boolean {
    return week.every((day) => this.isEnabled(day) && this.isSelected(day));
  }

  startDaySelection(event: MouseEvent, date: Date) {
    event.preventDefault();
    if (!this.isEnabled(date)) return;

    this.isDragging = true;
    this.isWeekSelection = false;
    this.selectionStart = date;
    this.tempSelectedDays = [...this.selectedDays];
    this.selectDay(date);
  }

  dragSelectDay(event: MouseEvent, date: Date) {
    event.preventDefault();
    if (!this.isDragging || !this.selectionStart || this.isWeekSelection)
      return;
    this.selectDaysInRange(this.selectionStart, date);
  }

  startWeekSelection(event: MouseEvent, week: Date[]) {
    event.preventDefault();
    this.isDragging = true;
    this.isWeekSelection = true;
    this.selectionStart = week[0];
    this.tempSelectedDays = [...this.selectedDays];
    this.toggleWeekSelection(week);
  }

  dragSelectWeek(event: MouseEvent, week: Date[]) {
    event.preventDefault();
    if (!this.isDragging || !this.selectionStart || !this.isWeekSelection)
      return;
    this.selectDaysInRange(this.selectionStart, week[week.length - 1]);
  }

  toggleWeekSelection(week: Date[]) {
    const isFullySelected = this.isWeekSelected(week);
    const enabledDays = week.filter((day) => this.isEnabled(day));

    if (isFullySelected) {
      // Deselect the week
      this.tempSelectedDays = this.tempSelectedDays.filter(
        (selectedDate) =>
          !enabledDays.some(
            (day) =>
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth() &&
              day.getFullYear() === selectedDate.getFullYear()
          )
      );
    } else {
      // Select the week
      enabledDays.forEach((day) => {
        if (!this.isSelected(day)) {
          this.tempSelectedDays.push(new Date(day));
        }
      });
    }
  }

  selectDaysInRange(start: Date, end: Date) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const minTime = Math.min(startTime, endTime);
    const maxTime = Math.max(startTime, endTime);

    this.tempSelectedDays = this.selectedDays.filter(
      (date) => date.getTime() < minTime || date.getTime() > maxTime
    );

    const currentDate = new Date(minTime);
    while (currentDate.getTime() <= maxTime) {
      if (this.isEnabled(currentDate)) {
        this.tempSelectedDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  selectDay(date: Date) {
    if (!this.isEnabled(date)) return;

    const index = this.tempSelectedDays.findIndex(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );

    if (index === -1) {
      this.tempSelectedDays.push(new Date(date));
    } else {
      this.tempSelectedDays.splice(index, 1);
    }
  }

  cancel() {
    this.selectedDays = [];
    this.isOpen = false;
  }

  validate() {
    console.log(
      'Selected dates:',
      this.selectedDays.sort((a, b) => a.getDate() - b.getDate())
    );
    this.isOpen = false;
  }
}
