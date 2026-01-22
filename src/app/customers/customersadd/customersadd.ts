import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-customersadd',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './customersadd.html',
  styleUrl: './customersadd.css',
})
export class Customersadd implements OnInit{

  customerId: number | null = null;

  customer = {
    first_name: '',
    last_name: '',
    customer_assignee: '',
    customer_status: '',
    mobile: '',
    email: '',
    company_name: '',
    industry_type: '',
    customer_source: '',
    website: '',
    door_no: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    description: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  private authService: Auth
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.customerId) {
      this.loadCustomerForEdit(this.customerId);
    }
  }

  loadCustomerForEdit(id: number) {
    
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<any>(`${this.authService.apiUrl}/customers/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.customer = data;
          console.log('Edit Customer Data:', this.customer);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching Customer:', err);
        },
      });
  }

  async saveCustomer() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    try {
      const response = await firstValueFrom(this.http.post(`${this.authService.apiUrl}/customers`, this.customer, { headers }));
      console.log('customer saved successfully:', response);
      this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  }

  async updateCustomer(customerId: number) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Customer saved successfully:', this.customer);
    try {
      const response = await firstValueFrom(this.http.put(`${this.authService.apiUrl}/customers/${customerId}`, this.customer, { headers }));
      // const response = await firstValueFrom(this.http.put(apiUrl, this.customer, { headers }));
      console.log('Customer Updated successfully:', response);
      this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  }

  clearForm() {
    this.customer = {
      first_name: '',
      last_name: '',
      customer_assignee: '',
      customer_status: '',
      mobile: '',
      email: '',
      company_name: '',
      industry_type: '',
      customer_source: '',
      website: '',
      door_no: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      description: '',
    };
  }

  goBack() {
    this.router.navigate(['/customers']);
  }
}
