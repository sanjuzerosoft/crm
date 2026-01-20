import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.customerId) {
      this.loadCustomerForEdit(this.customerId);
    }
  }

  loadCustomerForEdit(id: number) {
    // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    this.http
      .get<any>(`http://127.0.0.1:8000/api/customers/${id}`)
      // .get<any>(`http://127.0.0.1:8000/api/customers/${id}`, { headers })
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
    const apiUrl = 'http://127.0.0.1:8000/api/customers';
    
    try {
      const response = await firstValueFrom(this.http.post(apiUrl, this.customer));
      console.log('customer saved successfully:', response);
      this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error saving customer:', error);
      // Optionally show user-friendly error message
      alert('Failed to save customer. Please try again.');
    }
  }

  async updateCustomer(customerId: number) {
    const apiUrl = `http://127.0.0.1:8000/api/customers/${customerId}`;
  //   const token =
  //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';

  // const headers = new HttpHeaders({
  //   Authorization: `Bearer ${token}`,
  // });
    console.log('Customer saved successfully:', this.customer);
    try {
      const response = await firstValueFrom(this.http.put(apiUrl, this.customer));
      // const response = await firstValueFrom(this.http.put(apiUrl, this.customer, { headers }));
      console.log('Customer Updated successfully:', response);
      this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error saving customers:', error);
      // Optionally show user-friendly error message
      alert('Failed to update customers. Please try again.');
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
