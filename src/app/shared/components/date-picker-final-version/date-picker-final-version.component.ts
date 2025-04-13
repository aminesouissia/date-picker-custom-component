import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-date-picker-final-version',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-final-version.component.html',
  styleUrl: './date-picker-final-version.component.scss',
})
export class DatePickerFinalVersionComponent {
  isOpen = false;
  showInfoMessage = false;
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
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  enabledWeekdays = [true, true, true, true, true, true, true];
  currentDate = new Date();
  selectedDays: Date[] = [];
  isDragging = false;
  selectionStart: Date | null = null;
  enableHolidays = false;
  startTime = '09:00';
  endTime = '17:00';
  holidays: Date[] = [
    // 2024
    new Date(2024, 0, 1), // Jour de l'An
    new Date(2024, 3, 1), // Lundi de Pâques
    new Date(2024, 4, 1), // Fête du Travail
    new Date(2024, 4, 8), // Victoire 1945
    new Date(2024, 4, 9), // Ascension
    new Date(2024, 4, 20), // Lundi de Pentecôte
    new Date(2024, 6, 14), // Fête Nationale
    new Date(2024, 7, 15), // Assomption
    new Date(2024, 10, 1), // Toussaint
    new Date(2024, 10, 11), // Armistice 1918
    new Date(2024, 11, 25), // Noël
    // 2025
    new Date(2025, 0, 1), // Jour de l'An
    new Date(2025, 3, 21), // Lundi de Pâques
    new Date(2025, 4, 1), // Fête du Travail
    new Date(2025, 4, 8), // Victoire 1945
    new Date(2025, 4, 29), // Ascension
    new Date(2025, 5, 9), // Lundi de Pentecôte
    new Date(2025, 6, 14), // Fête Nationale
    new Date(2025, 7, 15), // Assomption
    new Date(2025, 10, 1), // Toussaint
    new Date(2025, 10, 11), // Armistice 1918
    new Date(2025, 11, 25), // Noël
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.resetTheme();
  }

  @HostListener('window:mouseup')
  onWindowMouseUp() {
    this.endDaySelection();
  }

  toggleCalendar() {
    if (this.isOpen) {
      this.reset();
    }
    this.isOpen = !this.isOpen;
    this.showInfoMessage = !this.showInfoMessage;
  }

  closeCalendar() {
    this.reset();
    this.isOpen = false;
    this.showInfoMessage = false;
  }

  toggleWeekday(index: number) {
    this.enabledWeekdays[index] = !this.enabledWeekdays[index];
    this.selectedDays = this.selectedDays.filter((day) => this.isEnabled(day));
  }

  updateHolidaySettings() {
    if (!this.enableHolidays) {
      this.selectedDays = this.selectedDays.filter(
        (day) => !this.isHoliday(day)
      );
    }
  }

  updateTimeRange() {
    console.log(
      `Plage horaire mise à jour : ${this.startTime} - ${this.endTime}`
    );
  }

  reset() {
    this.selectedDays = [];
    this.startTime = '09:00';
    this.endTime = '17:00';
    this.enableHolidays = false;
    this.enabledWeekdays = [true, true, true, true, true, true, true];
  }

  isHoliday(date: Date): boolean {
    return this.holidays.some(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear()
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

    return weeks;
  }

  getDaysInMonth(monthIndex: number): Date[] {
    const year = this.currentDate.getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const days: Date[] = [];

    // Get the first day of the week (Monday = 1, Sunday = 0)
    let firstDayOfWeek = firstDay.getDay() || 7;
    firstDayOfWeek = firstDayOfWeek === 1 ? 8 : firstDayOfWeek;

    // Add days from previous month
    for (let i = 1; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, monthIndex, 1 - i);
      days.unshift(prevDate);
    }

    // Add days of current month
    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }

    // Add days from next month to complete the grid
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

  previousYear() {
    this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1);
  }

  nextYear() {
    this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
  }

  isEnabled(date: Date): boolean {
    if (!this.enableHolidays && this.isHoliday(date)) return false;
    const dayIndex = (date.getDay() + 6) % 7;
    return this.enabledWeekdays[dayIndex];
  }

  isSelected(date: Date): boolean {
    return this.selectedDays.some(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );
  }

  isWeekSelected(week: Date[]): boolean {
    return week.every((day) => this.isSelected(day) || !this.isEnabled(day));
  }

  toggleWeekSelection(week: Date[]) {
    const isWeekSelected = this.isWeekSelected(week);

    if (isWeekSelected) {
      // Désélectionner la semaine
      week.forEach((day) => {
        const index = this.selectedDays.findIndex(
          (selectedDate) =>
            selectedDate.getDate() === day.getDate() &&
            selectedDate.getMonth() === day.getMonth() &&
            selectedDate.getFullYear() === day.getFullYear()
        );
        if (index !== -1) {
          this.selectedDays.splice(index, 1);
        }
      });
    } else {
      // Sélectionner la semaine
      week.forEach((day) => {
        if (this.isEnabled(day) && !this.isSelected(day)) {
          this.selectedDays.push(new Date(day));
        }
      });
    }
  }

  startDaySelection(event: MouseEvent, date: Date) {
    if (!this.isEnabled(date)) return;
    this.isDragging = true;
    this.selectionStart = date;
    this.selectDay(date);
  }

  dragSelectDay(event: MouseEvent, date: Date) {
    if (!this.isDragging || !this.selectionStart) return;
    this.selectDaysInRange(this.selectionStart, date);
  }

  endDaySelection() {
    this.isDragging = false;
    this.selectionStart = null;
  }

  selectDaysInRange(start: Date, end: Date) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const minTime = Math.min(startTime, endTime);
    const maxTime = Math.max(startTime, endTime);

    this.selectedDays = this.selectedDays.filter(
      (date) => date.getTime() < minTime || date.getTime() > maxTime
    );

    const currentDate = new Date(minTime);
    while (currentDate.getTime() <= maxTime) {
      if (this.isEnabled(currentDate)) {
        this.selectedDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  selectDay(date: Date) {
    if (!this.isEnabled(date)) return;

    const index = this.selectedDays.findIndex(
      (selectedDate) =>
        selectedDate.getDate() === date.getDate() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getFullYear() === date.getFullYear()
    );

    if (index === -1) {
      this.selectedDays.push(new Date(date));
    } else {
      this.selectedDays.splice(index, 1);
    }
  }

  validate() {
    console.log('Dates sélectionnées:', this.selectedDays);
    console.log('Plage horaire:', { début: this.startTime, fin: this.endTime });
    this.isOpen = false;
    this.showInfoMessage = false;
  }

  closeInfoMessage() {
    this.showInfoMessage = false;
  }
}
