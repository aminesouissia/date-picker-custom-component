import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  imports: [CommonModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {
  @Output() dateChange = new EventEmitter<Date>();

  isOpen = false;
  selectedDate: Date | null = null;
  currentYear = new Date().getFullYear();

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  toggleCalendar() {
    this.isOpen = !this.isOpen;
  }

  getDaysInMonth(monthIndex: number): number[] {
    const days: number[] = [];
    const firstDay = new Date(this.currentYear, monthIndex, 1);
    const lastDay = new Date(this.currentYear, monthIndex + 1, 0);

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(0);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  }

  selectDay(day: number, monthIndex: number) {
    if (day === 0) return; // Skip empty days
    this.selectedDate = new Date(this.currentYear, monthIndex, day);
    this.dateChange.emit(this.selectedDate);
    this.isOpen = false;
  }

  isSelectedDay(day: number, monthIndex: number): boolean {
    if (!this.selectedDate || day === 0) return false;
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === monthIndex &&
      this.selectedDate.getFullYear() === this.currentYear
    );
  }

  isToday(day: number, monthIndex: number): boolean {
    if (day === 0) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === monthIndex &&
      today.getFullYear() === this.currentYear
    );
  }

  previousYear() {
    this.currentYear--;
  }

  nextYear() {
    this.currentYear++;
  }
}
