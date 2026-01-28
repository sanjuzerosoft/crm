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
  selector: 'app-leadassigneelist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leadassigneelist.html',
  styleUrls: ['./leadassigneelist.css'],
})
export class Leadassigneelist implements OnInit {

  searchSubject: Subject<string> = new Subject<string>();
isLoading = false;


  assignees: any[] = [];
  allAssignees: any[] = []; 
  searchText: string = '';

  showDeletePopup = false;
  selectedAssigneeId: number | null = null;

  constructor(private router: Router,
      private authService: Auth,      
    private cdr: ChangeDetectorRef,
    private http: HttpClient,) {}

  ngOnInit() {
    this.getLeadAsignee();

    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe((text) => {
      this.searchAssignees(text);
    });
  }

  getLeadAsignee() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
          .get<any[]>(`${this.authService.apiUrl}/lead-assignees`, { headers })
          .pipe(
            catchError((error) => {
              console.error('Error fetching leads:', error);
              return throwError(() => error);
            }),
          )
          .subscribe({
        next: (data) => {
          this.assignees = data;
          this.allAssignees = data;
          console.log('Leads:', this.assignees);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching leads:', error);
        },
      });
  }

  // 🔍 Search
  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  searchAssignees(searchText: string) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.isLoading = true;

  this.http
    .get<any[]>(
      `${this.authService.apiUrl}/lead-assignees?search=${searchText}`,
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
      this.assignees = data;
      this.isLoading = false;
    });
}


  // 📊 Count
  get totalAssignees(): number {
    return this.assignees.length;
  }

  // ➕ Add
  addAssignee() {
  this.router.navigate(['leadassignee/add']);
}


  // ✏️ Edit
  editAssignee(id: number) {
    console.log('Edit assignee:', id);
    this.router.navigate(['leadassignee/add',id]);
    // this.router.navigate(['/masters/lead-assignee/edit', id]);
  }

  // ❌ Delete popup
  openDeletePopup(id: number) {
    this.selectedAssigneeId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedAssigneeId = null;
  }
  deleteAssignee(id: number) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .delete(`${this.authService.apiUrl}/lead-assignees/${id}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Delete failed:', error);
        return throwError(() => error);
      })
    )
    .subscribe(() => {
      this.getLeadAsignee()
      this.assignees = this.assignees.filter(a => a.id !== id);
      this.allAssignees = this.allAssignees.filter(a => a.id !== id);
    });
}


  confirmDelete() {
     if (this.selectedAssigneeId !== null) {
    this.deleteAssignee(this.selectedAssigneeId);
  }
  this.closeDeletePopup()
  }
}
