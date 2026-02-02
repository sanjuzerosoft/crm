import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-leadsadd',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './leadsadd.html',
  styleUrl: './leadsadd.css',
})
export class Leadsadd implements OnInit {

  leadId: number | null = null;  

  assignee :any [] = [];
  industry : any [] = [];

  lead = {
    first_name: '',
    last_name: '',
    lead_assignee: '',
    lead_status: '',
    mobile: '',
    email: '',
    company_name: '',
    industry_type: '',
    lead_source: '',
    website: '',
    door_no: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    description: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  private authService: Auth
  ) {}  
  ngOnInit(): void {
    this.leadId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadassignee();
    this.loadindustry();

    if (this.leadId) {
      this.loadLeadForEdit(this.leadId);
    }
  }

  loadassignee(){
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization : `Bearer ${token}`
    })

    this.http
    .get<any[]>(`${this.authService.apiUrl}/lead-assignees`,{headers}).subscribe({
      next: (data) => {
          this.assignee = data;
          console.log('Assignee_:', this.assignee);
      },
      error:(err) =>{
        console.log('Error loading assignee:', err);
      }
    })
  }

  loadindustry(){
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization : `Bearer ${token}`
    })

    this.http
    .get<any[]>(`${this.authService.apiUrl}/industry-types`,{headers}).subscribe({
      next: (data) => {
          this.industry = data;
          console.log('industry:', this.industry);
      },
      error:(err) =>{
        console.log('Error loading industry:', err);
      }
    })
  }

  loadLeadForEdit(id: number) {
    const token = this.authService.getToken();    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/leads/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.lead = data;
          console.log('Edit Lead Data:', this.lead);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching lead:', err);
        },
      });
  }

  async saveLead() {
    const token = this.authService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.post(`${this.authService.apiUrl}/leads`, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }
  async updateLead(leadId: number) {
    const token =this.authService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.put(`${this.authService.apiUrl}/leads/${leadId}`, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }
  

  clearForm() {
    this.lead = {
      first_name: '',
      last_name: '',
      lead_assignee: '',
      lead_status: '',
      mobile: '',
      email: '',
      company_name: '',
      industry_type: '',
      lead_source: '',
      website: '',
      door_no: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      description: '',
    };
  }

  goBack() {
    this.router.navigate(['/leads']);
  }
}
