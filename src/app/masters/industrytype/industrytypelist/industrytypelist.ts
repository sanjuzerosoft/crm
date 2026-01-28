import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-industrytypelist',
  imports: [CommonModule, FormsModule],
  templateUrl: './industrytypelist.html',
  styleUrl: './industrytypelist.css',
})
export class Industrytypelist implements OnInit {

  searchSubject: Subject<string> = new Subject<string>();
isLoading = false;


  Industrytype: any[] = [];
  allIndustrytype: any[] = []; 
  searchText: string = '';

  showDeletePopup = false;
  selectedIndustryId: number | null = null;

  constructor(private router: Router,
      private authService: Auth,      
    private cdr: ChangeDetectorRef,
    private http: HttpClient,) {}

  ngOnInit() {
    this.getIndustrytype();

    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe((text) => {
      this.searchIndustrytypes(text);
    });
  }

  getIndustrytype() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
          .get<any[]>(`${this.authService.apiUrl}/industry-types`, { headers })
          .pipe(
            catchError((error) => {
              console.error('Error fetching Industrytype:', error);
              return throwError(() => error);
            }),
          )
          .subscribe({
        next: (data) => {
          this.Industrytype = data;
          this.allIndustrytype = data;
          console.log('Industrytype:', this.Industrytype);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching Industrytype:', error);
        },
      });
  }

  // 🔍 Search
  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  searchIndustrytypes(searchText: string) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.isLoading = true;

  this.http
    .get<any[]>(
      `${this.authService.apiUrl}/industry-types?search=${searchText}`,
      { headers }
    )
    .pipe(
      catchError((error) => {
        console.error('Search failed:', error);
        this.isLoading = false;
        return throwError(() => error);
      })
    )
    .subscribe((data) => {
      this.Industrytype = data;
      this.isLoading = false;
    });
}


  // 📊 Count
  get totalIndustrytypes(): number {
    return this.Industrytype.length;
  }

  // ➕ Add
  addIndustrytype() {
  this.router.navigate(['IndustryType/add']);
}


  // ✏️ Edit
  editIndustrytype(id: number) {
    console.log('Edit Industrytype:', id);
    this.router.navigate(['IndustryType/add',id]);
  }

  // ❌ Delete popup
  openDeletePopup(id: number) {
    this.selectedIndustryId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedIndustryId = null;
  }
  deleteIndustrytype(id: number) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .delete(`${this.authService.apiUrl}/industry-types/${id}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Delete failed:', error);
        return throwError(() => error);
      })
    )
    .subscribe(() => {
      this.getIndustrytype()
      this.Industrytype = this.Industrytype.filter(a => a.id !== id);
      this.allIndustrytype = this.allIndustrytype.filter(a => a.id !== id);
    });
}


  confirmDelete() {
     if (this.selectedIndustryId !== null) {
    this.deleteIndustrytype(this.selectedIndustryId);
  }
  this.closeDeletePopup()
  }
}
