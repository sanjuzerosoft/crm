import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leadslist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leadslist.html',
  styleUrl: './leadslist.css',
})
export class Leadslist implements OnInit {
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

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  getLeads() {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzNjkxMjUsImV4cCI6MTc2ODM3MjcyNSwibmJmIjoxNzY4MzY5MTI1LCJqdGkiOiJDeEJRbkVobHR5UGpIWFNBIiwic3ViIjoiMyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.fx3Cf1GtzM7jylScJ6mrxmLuZp9WhV3WmWyNwROuaGg';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('header', headers);
    this.http
      .get<any[]>('http://127.0.0.1:8000/api/leads', { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching leads:', error);
          return throwError(() => error);
        })
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
  }

  onSearch() {
    const value = this.searchText.toLowerCase();

    this.leads = this.allLeads.filter(
      (lead) =>
        lead.first_name.toLowerCase().includes(value) ||
        lead.email.toLowerCase().includes(value) ||
        lead.mobile.toLowerCase().includes(value)
    );
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
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI0MDEsImV4cCI6MTc2ODMwNjAwMSwibmJmIjoxNzY4MzAyNDAxLCJqdGkiOiJsNlNpaUpmaHhOWTBGREtvIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.dxlQEEqvCf31TbqqJj9QB61E3eRxzNJpIjHBg2nZqMI';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Example API call
    this.http
      .delete(`http://127.0.0.1:8000/api/leads/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Delete failed:', error);
          alert('Unauthorized or failed request');
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.getLeads();
        this.leads = this.leads.filter((l) => l.id !== id);
        this.allLeads = this.allLeads.filter((l) => l.id !== id);
      });
  }
}
