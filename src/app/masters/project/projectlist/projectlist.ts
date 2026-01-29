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
  selector: 'app-projectlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './projectlist.html',
  styleUrl: './projectlist.css',
})
export class Projectlist implements OnInit {
searchSubject: Subject<string> = new Subject<string>();
isLoading = false;


  projects: any[] = [];
  allprojects: any[] = []; 
  searchText: string = '';

  showDeletePopup = false;
  selectedprojectId: number | null = null;

  constructor(private router: Router,
      private authService: Auth,      
    private cdr: ChangeDetectorRef,
    private http: HttpClient,) {}

  ngOnInit() {
    this.getProjects();
  this.searchText = '';

    this.searchSubject
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe((searchText) => {
      if (searchText.trim() === '') {
        this.projects = [...this.allprojects];
      } else {
        this.searchprojects(searchText);
      }
      this.cdr.detectChanges();
    });
  }

  getProjects() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
          .get<any[]>(`${this.authService.apiUrl}/projects`, { headers })
          .pipe(
            catchError((error) => {
              console.error('Error fetching projects:', error);
              return throwError(() => error);
            }),
          )
          .subscribe({
        next: (data) => {
          this.projects = data;
          this.allprojects = data;
          console.log('Projects:', this.projects);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  // 🔍 Search
  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  searchprojects(searchText: string) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.isLoading = true;

  this.http
    .get<any[]>(
      `${this.authService.apiUrl}/projects?search=${searchText}`,
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
      this.projects = data;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
}


  // 📊 Count
  get totalProjects(): number {
    return this.projects.length;
  }

  // ➕ Add
  addproject() {
  this.router.navigate(['project/add']);
}


  // ✏️ Edit
  editProject(id: number) {
    console.log('Edit project:', id);
    this.router.navigate(['project/add',id]);
    // this.router.navigate(['/masters/project/edit', id]);
  }

  // ❌ Delete popup
  openDeletePopup(id: number) {
    this.selectedprojectId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedprojectId = null;
  }
  deleteProject(id: number) {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .delete(`${this.authService.apiUrl}/projects/${id}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Delete failed:', error);
        return throwError(() => error);
      })
    )
    .subscribe(() => {
      this.getProjects();
      this.projects = this.projects.filter(p => p.id !== id);
      this.allprojects = this.allprojects.filter(p => p.id !== id);
    });
}


  confirmDelete() {
     if (this.selectedprojectId !== null) {
    this.deleteProject(this.selectedprojectId);
  }
  this.closeDeletePopup()
  }

  assigneeeMaster(){
    this.router.navigate(['leadassignee']);
  }
  industryMaster(){
    this.router.navigate(['IndustryType']);
  }
  projectMaster(){
    this.router.navigate(['project']);
  }
}
