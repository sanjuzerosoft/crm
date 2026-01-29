import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-projectadd',
  imports: [CommonModule, FormsModule],
  templateUrl: './projectadd.html',
  styleUrl: './projectadd.css',
})
export class Projectadd implements OnInit {   

  projectId: number | null = null;

  project = {
    name: '',
    status: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.loadProjectForEdit(this.projectId);
    }
  }

  /* 🔹 Load Project for edit */
  loadProjectForEdit(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/projects/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.project = data;
          console.log("Project",this.project)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching Project:', err);
        },
      });
  }

  /* 🔹 Save Project */
  async saveProject() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.authService.apiUrl}/projects`,
          this.project,
          { headers }
        )
      );
      console.log('Project saved:', response);
      this.router.navigate(['/project']);
    } catch (error) {
      console.error('Error saving Project:', error);
    }
  }

  /* 🔹 Update Project */
  async updateProject(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.put(
          `${this.authService.apiUrl}/projects/${id}`,
          this.project,
          { headers }
        )
      );
      console.log('Project updated:', response);
      this.router.navigate(['/project']);
    } catch (error) {
      console.error('Error updating Project:', error);
    }
  }

  /* 🔹 Clear form */
  clearForm() {
    this.project = {
      name: '',
      status: '',
    };
  }

  /* 🔹 Go back */
  goBack() {
    this.router.navigate(['/project']);
  }
}
