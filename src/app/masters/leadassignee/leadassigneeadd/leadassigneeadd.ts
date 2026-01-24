import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-leadassigneeadd',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './leadassigneeadd.html',
  styleUrl: './leadassigneeadd.css',
})
export class Leadassigneeadd implements OnInit {

  assigneeId: number | null = null;

  assignee = {
    name: '',
    email: '',
    mobile: '',
    role: '',
    status: '',
    description: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.assigneeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.assigneeId) {
      this.loadAssigneeForEdit(this.assigneeId);
    }
  }

  /* 🔹 Load assignee for edit */
  loadAssigneeForEdit(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/lead-assignees/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.assignee = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching assignee:', err);
        },
      });
  }

  /* 🔹 Save assignee */
  async saveAssignee() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.authService.apiUrl}/lead-assignees`,
          this.assignee,
          { headers }
        )
      );
      console.log('Assignee saved:', response);
      this.router.navigate(['/masters/lead-assignee']);
    } catch (error) {
      console.error('Error saving assignee:', error);
    }
  }

  /* 🔹 Update assignee */
  async updateAssignee(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.put(
          `${this.authService.apiUrl}/lead-assignees/${id}`,
          this.assignee,
          { headers }
        )
      );
      console.log('Assignee updated:', response);
      this.router.navigate(['/masters/lead-assignee']);
    } catch (error) {
      console.error('Error updating assignee:', error);
    }
  }

  /* 🔹 Clear form */
  clearForm() {
    this.assignee = {
      name: '',
      email: '',
      mobile: '',
      role: '',
      status: '',
      description: '',
    };
  }

  /* 🔹 Go back */
  goBack() {
    this.router.navigate(['/masters/lead-assignee']);
  }
}
