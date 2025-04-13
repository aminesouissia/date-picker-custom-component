import { Component } from '@angular/core';
import { DatePickerFinalVersionComponent } from './shared/components/date-picker-final-version/date-picker-final-version.component';
import { ThemeService } from './shared/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    DatePickerFinalVersionComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedDate: Date | null = null;

  onDateChange(date: Date) {
    this.selectedDate = date;
    console.log('Selected date:', date);
  }

  constructor(private themeService: ThemeService) {}

  setDarkTheme() {
    this.themeService.setTheme({
      primary: '#bb86fc',
      primaryLight: '#3700b3',
      primaryDark: '#6200ee',
      background: '#121212',
      surface: '#1e1e1e',
      border: '#333333',
      text: '#ffffff',
      textLight: '#bbbbbb',
      disabled: '#222222',
      hover: '#2c2c2c',
    });
  }

  setLightTheme() {
    this.themeService.resetTheme();
  }

  setCustomTheme() {
    this.themeService.setTheme({
      primary: '#2e7d32',
      primaryLight: '#4caf50',
      primaryDark: '#1b5e20',
      secondary: '#757575',
      background: '#ffffff',
      surface: '#f5f5f5',
      border: '#e0e0e0',
      text: '#212121',
      textLight: '#757575',
      disabled: '#eeeeee',
      hover: '#e8f5e9',
    });
  }
}
