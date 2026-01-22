import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';

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
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}
  ngOnInit() {
    // ✅ Get ID from URL
    
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.http
      .get<any>(`${this.authService.apiUrl}/customers/${this.customerId}`, { headers })
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
