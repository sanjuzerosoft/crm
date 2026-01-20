import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // ✅ Get ID from URL
    this.leadId = Number(this.route.snapshot.paramMap.get('id'));
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`http://127.0.0.1:8000/api/leads/${this.leadId}`, { headers })
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
