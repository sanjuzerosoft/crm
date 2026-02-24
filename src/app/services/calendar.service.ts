import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {}

  getActivities() {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/activities')
      .pipe(
        map((res: any[]) => {
          return res.map(item => {
            // ✅ Fix: parse date parts manually to avoid timezone shift
            const dateStr = item.scheduled_date || item.activity_date;
            const [year, month, day] = dateStr.split('-').map(Number);
            const parsedDate = new Date(year, month - 1, day); // ✅ local time, no UTC shift

            return {
              id: item.id,
              activity_type: item.activity_type as 'call' | 'meeting' | 'demo',
              company: item.lead?.company_name || item.customer?.company_name || 'N/A',
              time: item.scheduled_time ? this.formatTime(item.scheduled_time) : '',
              date: parsedDate
            };
          });
        })
      );
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    let h = +hour;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  }
}