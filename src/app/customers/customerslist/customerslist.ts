import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-customerslist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './customerslist.html',
  styleUrl: './customerslist.css',
})
export class Customerslist implements OnInit {  
  searchSubject: Subject<string> = new Subject<string>();  
  isLoading = false;
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

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}

  getCustomers() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<any[]>(`${this.authService.apiUrl}/customers`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        }),
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

    this.searchSubject
    .pipe(
      debounceTime(500),        // wait 500ms after typing stops
      distinctUntilChanged()    // only if value changed
    )
    .subscribe((searchText) => {
      this.searchCustomers(searchText);
    });
  }

  //new

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  searchCustomers(searchText: string) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.isLoading = true;

  this.http
    .get<any[]>(`${this.authService.apiUrl}/customers?search=${searchText}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Search failed:', error);
        this.isLoading = false;
        return throwError(() => error);
      })
    )
    .subscribe((data) => {
      this.customers = data;
      console.log('customers search:', this.customers);
      this.isLoading = false;
    });
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
    
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .delete(`${this.authService.apiUrl}/customers/${id}`,{ headers })
      .pipe(
        catchError((error) => {
          console.error('Delete failed:', error);
          return throwError(() => error);
        }),
      )
      .subscribe(() => {
        this.getCustomers();
        this.customers = this.customers.filter((l) => l.id !== id);
        this.allCustomers = this.allCustomers.filter((l) => l.id !== id);
      });
  }
}
