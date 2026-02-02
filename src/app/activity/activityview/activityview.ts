import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-activityview',
  imports: [CommonModule, FormsModule],
  templateUrl: './activityview.html',
  styleUrl: './activityview.css',
})
export class Activityview implements OnInit {
  activities: any = null;

  activityId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute, //read data from url like("activity/view/5")
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}

  ngOnInit() {
    // ✅ Get ID from URL
    this.activityId = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/activities/${this.activityId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching activities:', error);
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (data) => {
          this.activities = data;
          console.log('Activities:', this.activities);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching activities:', error);
        },
      });
  }

  goBack() {
    this.router.navigate(['/activity']);
  }
  goToEdit() {
    this.router.navigate(['/activity/add', this.activityId]);
  }
}
