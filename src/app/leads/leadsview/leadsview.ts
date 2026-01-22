import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-leadsview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leadsview.html',
  styleUrl: './leadsview.css',
})
export class Leadsview implements OnInit {
  leads: any =null;

  leadId: number | null = null;  

  constructor(
    private router: Router,
    private route: ActivatedRoute,  //read data from url like("leads/view/5")
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService : Auth
  ) {}

  ngOnInit() {
    // ✅ Get ID from URL
    this.leadId = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/leads/${this.leadId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching leads:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => {
          this.leads = data;
          console.log('Leads:', this.leads);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching leads:', error);
        },
      });
  }

  goBack() {
    this.router.navigate(['/leads']);
  }
  goToEdit() {
    this.router.navigate(['/leads/add',this.leadId]);
  }
}
