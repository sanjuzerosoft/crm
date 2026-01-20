import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-customersview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customersview.html',
  styleUrl: './customersview.css',
})
export class Customersview {

  customer: any =null;

  customerId: number | null = null;  
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,  //read data from url like("leads/view/5")
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    // ✅ Get ID from URL
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    // const token =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    this.http
      .get<any>(`http://127.0.0.1:8000/api/customers/${this.customerId}`)
      // .get<any>(`http://127.0.0.1:8000/api/customers/${this.customerId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customer:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => {
          this.customer = data;
          console.log('customer:', this.customer);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching customer:', error);
        },
      });
  }

  goBack() {
    this.router.navigate(['/customers']);
  }
  goToEdit() {
    this.router.navigate(['/customers/add',this.customerId]);
  }
}
