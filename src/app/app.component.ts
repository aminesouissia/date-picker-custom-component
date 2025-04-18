import { Component } from '@angular/core';
import { DatePickerFinalVersionComponent } from './shared/components/date-picker-final-version/date-picker-final-version.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [DatePickerFinalVersionComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
