import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Holiday {
  date: Date;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private readonly API_URL = 'https://calendrier.api.gouv.fr/jours-feries';

  constructor(private http: HttpClient) {}

  getHolidays(year: number, zone: string = 'metropole'): Observable<Holiday[]> {
    return this.http
      .get<Record<string, string>>(`${this.API_URL}/${zone}/${year}.json`)
      .pipe(
        map((response) => {
          return Object.entries(response).map(([date, name]) => ({
            date: new Date(date),
            name,
            type: 'public',
          }));
        }),
        catchError(() => {
          console.warn('Failed to fetch holidays, using fallback data');
          return of(this.getFallbackHolidays(year));
        })
      );
  }

  private getFallbackHolidays(year: number): Holiday[] {
    const defaultHolidays = [
      { date: new Date(year, 0, 1), name: "Jour de l'An" },
      { date: new Date(year, 4, 1), name: 'Fête du Travail' },
      { date: new Date(year, 4, 8), name: 'Victoire 1945' },
      { date: new Date(year, 6, 14), name: 'Fête Nationale' },
      { date: new Date(year, 7, 15), name: 'Assomption' },
      { date: new Date(year, 10, 1), name: 'Toussaint' },
      { date: new Date(year, 10, 11), name: 'Armistice 1918' },
      { date: new Date(year, 11, 25), name: 'Noël' },
    ];

    return defaultHolidays.map((holiday) => ({
      ...holiday,
      type: 'public',
    }));
  }
}
