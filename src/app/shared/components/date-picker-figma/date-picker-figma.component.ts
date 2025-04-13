import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachDayOfInterval,
  getWeek,
  format,
  subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
@Component({
  selector: 'app-date-picker-figma',
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-figma.component.html',
  styleUrl: './date-picker-figma.component.scss',
})
export class DatePickerFigmaComponent {
  showCalendar = false;
  months: Date[] = [];
  selectedDates: Date[] = [];
  weekDays = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];
  enabledWeekDays = [true, true, true, true, true, true, true];

  constructor() {
    this.initializeMonths();
  }

  initializeMonths() {
    const currentDate = new Date();
    const startDate = subMonths(startOfYear(currentDate), 1);
    const endDate = endOfYear(currentDate);

    this.months = eachMonthOfInterval({ start: startDate, end: endDate });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  getWeeksInMonth(month: Date) {
    return eachWeekOfInterval({
      start: month,
      end: new Date(month.getFullYear(), month.getMonth() + 1, 0),
      weekStartsOn: 1,
    });
  }

  getDaysInWeek(week: Date) {
    return eachDayOfInterval({
      start: week,
      end: new Date(week.getFullYear(), week.getMonth(), week.getDate() + 6),
    });
  }

  toggleDate(date: Date) {
    const index = this.selectedDates.findIndex(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );

    if (index === -1) {
      this.selectedDates.push(date);
    } else {
      this.selectedDates.splice(index, 1);
    }
  }

  selectWeek(weekStart: Date) {
    const weekDays = this.getDaysInWeek(weekStart);
    weekDays.forEach((day) => {
      if (!this.isSelected(day)) {
        this.toggleDate(day);
      }
    });
  }

  selectYear() {
    const yearDays = eachDayOfInterval({
      start: this.months[0],
      end: this.months[this.months.length - 1],
    });

    this.selectedDates = yearDays;
  }

  isSelected(date: Date): boolean {
    return this.selectedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  }

  updateWeekDays() {
    this.selectedDates = this.selectedDates.filter(
      (date) => this.enabledWeekDays[(date.getDay() + 6) % 7]
    );
  }

  getSelectedDatesText(): string {
    if (this.selectedDates.length === 0) return '';
    if (this.selectedDates.length === 1) {
      return format(this.selectedDates[0], 'dd/MM/yyyy');
    }
    return `${this.selectedDates.length} dates sélectionnées`;
  }

  format(date: Date, formatStr: string): string {
    return format(date, formatStr, { locale: fr });
  }

  getWeek(date: Date): number {
    return getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 });
  }
}
