import { Injectable } from '@angular/core';

export interface DatepickerTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textLight: string;
  disabled: string;
  hover: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private defaultTheme: DatepickerTheme = {
    primary: '#007bff',
    primaryLight: '#e3f2fd',
    primaryDark: '#0056b3',
    secondary: '#666666',
    background: '#ffffff',
    surface: '#f5f5f5',
    border: '#cccccc',
    text: '#333333',
    textLight: '#666666',
    disabled: '#f8f8f8',
    hover: '#f0f0f0',
  };

  private currentTheme: DatepickerTheme = { ...this.defaultTheme };

  getTheme(): DatepickerTheme {
    return this.currentTheme;
  }

  setTheme(theme: Partial<DatepickerTheme>) {
    this.currentTheme = { ...this.currentTheme, ...theme };
    this.updateCssVariables();
  }

  resetTheme() {
    this.currentTheme = { ...this.defaultTheme };
    this.updateCssVariables();
  }

  private updateCssVariables() {
    const root = document.documentElement;
    Object.entries(this.currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--datepicker-${this.kebabCase(key)}`, value);
    });
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
