import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../services/auth';
@Component({
  selector: 'app-industrytypeadd',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './industrytypeadd.html',
  styleUrl: './industrytypeadd.css',
})

export class Industrytypeadd implements OnInit {

  IndustryTypeId: number | null = null;

  IndustryType = {
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
    this.IndustryTypeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.IndustryTypeId) {
      this.loadIndustryTypeForEdit(this.IndustryTypeId);
    }
  }

  /* 🔹 Load IndustryType for edit */
  loadIndustryTypeForEdit(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/industry-types/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.IndustryType = data;
          console.log("IndustryType",this.IndustryType)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching IndustryType:', err);
        },
      });
  }

  /* 🔹 Save IndustryType */
  async saveIndustryType() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.authService.apiUrl}/industry-types`,
          this.IndustryType,
          { headers }
        )
      );
      console.log('IndustryType saved:', response);
      this.router.navigate(['/IndustryType']);
    } catch (error) {
      console.error('Error saving IndustryType:', error);
    }
  }

  /* 🔹 Update IndustryType */
  async updateIndustryType(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await firstValueFrom(
        this.http.put(
          `${this.authService.apiUrl}/industry-types/${id}`,
          this.IndustryType,
          { headers }
        )
      );
      console.log('IndustryType updated:', response);
      this.router.navigate(['/IndustryType']);
    } catch (error) {
      console.error('Error updating IndustryType:', error);
    }
  }

  /* 🔹 Clear form */
  clearForm() {
    this.IndustryType = {
      name: '',
      status: '',
    };
  }

  /* 🔹 Go back */
  goBack() {
    this.router.navigate(['/IndustryType']);
  }
}
