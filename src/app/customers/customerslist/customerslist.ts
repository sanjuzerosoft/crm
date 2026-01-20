import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-customerslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customerslist.html',
  styleUrl: './customerslist.css',
})
export class Customerslist implements OnInit {
  customers: any[] = [];
  allCustomers: any[] = [];
  searchText: string = '';
  showDeletePopup = false;
  selectedCustomerId: number | null = null;

  openDeletePopup(id: number) {
    this.selectedCustomerId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedCustomerId = null;
  }

  confirmDelete() {
    if (this.selectedCustomerId !== null) {
      this.deleteCustomer(this.selectedCustomerId);
    }
    this.closeDeletePopup();
  }

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}


getCustomers() {
    // const token =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });
    this.http
      .get<any[]>('http://127.0.0.1:8000/api/customers')
      .pipe(
        catchError((error) => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => {
          this.customers = data;
          this.allCustomers = data;
          console.log('customers:', this.customers);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching customers:', error);
        },
      });
  }

  ngOnInit() {
    this.getCustomers();
  }

  onSearch() {
    const value = this.searchText.toLowerCase();

    this.customers = this.allCustomers.filter(
      (item) =>
        item.first_name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.mobile.toLowerCase().includes(value)
    );
  }

  get totalcustomers(): number {
    return this.customers.length;
  }

  AddCustomers() {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(id: number) {
    console.log('Edit customer:', id);
    this.router.navigate(['/customers/view', id]);
  }

  
  viewCustomer(id: number) {
    console.log('Edit customer:', id);
    this.router.navigate(['/customers/view', id]);
  }

  deleteCustomer(id: number) {
    // const token =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI0MDEsImV4cCI6MTc2ODMwNjAwMSwibmJmIjoxNzY4MzAyNDAxLCJqdGkiOiJsNlNpaUpmaHhOWTBGREtvIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.dxlQEEqvCf31TbqqJj9QB61E3eRxzNJpIjHBg2nZqMI';
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    this.http
      .delete(`http://127.0.0.1:8000/api/customers/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Delete failed:', error);
          alert('Unauthorized or failed request');
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.getCustomers();
        this.customers = this.customers.filter((l) => l.id !== id);
        this.allCustomers = this.allCustomers.filter((l) => l.id !== id);
      });
  }

}
