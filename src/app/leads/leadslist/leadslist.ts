import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-leadslist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leadslist.html',
  styleUrl: './leadslist.css',
})
export class Leadslist implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();
  isLoading = false;
  leads: any[] = [];
  allLeads: any[] = []; // backup list
  searchText: string = ''; //search input
  showDeletePopup = false;
  selectedLeadId: number | null = null;

  openDeletePopup(id: number) {
    this.selectedLeadId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedLeadId = null;
  }

  confirmDelete() {
    if (this.selectedLeadId !== null) {
      this.deleteLead(this.selectedLeadId);
    }
    this.closeDeletePopup();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}

  getLeads() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('header', this.authService.apiUrl);
    console.log('token', this.authService.getToken());
    this.http
      .get<any[]>(`${this.authService.apiUrl}/leads`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching leads:', error);
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (data) => {
          this.leads = data;
          this.allLeads = data;
          console.log('Leads:', this.leads);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching leads:', error);
        },
      });
  }

  ngOnInit() {
  this.getLeads();
  this.searchText = '';

  this.searchSubject
    .pipe(
      debounceTime(300),        // wait 500ms after typing stops
      distinctUntilChanged()    // only if value changed
    )
    .subscribe((searchText) => {
      // this.searchLeads(searchText);
      if (searchText.trim() === '') {
        this.leads = [...this.allLeads];
      } else {
        this.searchLeads(searchText);
      }
      this.cdr.detectChanges();
    });
}


  onSearch() {
  this.searchSubject.next(this.searchText);
}
searchLeads(searchText: string) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.isLoading = true;

  this.http
    .get<any[]>(`${this.authService.apiUrl}/leads?search=${searchText}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Search failed:', error);
        this.isLoading = false;
        return throwError(() => error);
      })
    )
    .subscribe((data) => {
      this.leads = data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
}


  get totalLeads(): number {
    return this.leads.length;
  }

  AddLeads() {
    this.router.navigate(['/leads/add']);
  }

  editLead(id: number) {
    console.log('Edit lead:', id);
    // this.router.navigate(['/leads/view', [id]]);
  }

  viewLead(id: number) {
    console.log('Edit lead:', id);
    this.router.navigate(['/leads/view', id]);
  }

  deleteLead(id: number) {
    console.log('Deleting lead:', id);
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Example API call
    this.http
      .delete(`${this.authService.apiUrl}/leads/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Delete failed:', error);
          return throwError(() => error);
        }),
      )
      .subscribe(() => {
        this.getLeads();
        this.leads = this.leads.filter((l) => l.id !== id);
        this.allLeads = this.allLeads.filter((l) => l.id !== id);
      });
  }
}
