import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  get totalLeadsByMonth(): number {
  return this.leadsByMonth.reduce((sum, val) => sum + val, 0);
}

get totalCustomersByMonth(): number {
  return this.customersByMonth.reduce((sum, val) => sum + val, 0);
}

  // ===== API DATA =====
  totalLeads = 0;
  totalCustomers = 0;

  activeLeads = 0;
  inactiveLeads = 0;

  activeCustomers = 0;
  inactiveCustomers = 0;

  leadsByMonth: number[] = [];
  customersByMonth: number[] = [];

  // ===== CHART REFERENCES =====
  charts: Chart[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ==============================
  // API CALL
  // ==============================
  loadDashboardData() {
    this.http
      .get<any>(`${this.authService.apiUrl}/dashboard-report`)
      .subscribe({
        next: (res) => {
          console.log('Dashboard API Response:', res);

          // ---- TOTALS ----
          this.totalLeads = res.total_leads ?? 0;
          this.totalCustomers = res.total_customers ?? 0;

          // ---- STATUS ----
          this.activeLeads = res.lead_status?.active ?? 0;
          this.inactiveLeads = res.lead_status?.inactive ?? 0;

          this.activeCustomers = res.customer_status?.active ?? 0;
          this.inactiveCustomers = res.customer_status?.inactive ?? 0;

          // ---- LAST 6 MONTHS ----
          this.leadsByMonth = this.mapLast6Months(res.leads_last_6_months);
          this.customersByMonth = this.mapLast6Months(res.customers_last_6_months);

          this.cdr.detectChanges();

          // Render charts AFTER data loads
          this.renderCharts();
        },
        error: (err) => {
          console.error('Dashboard API Error:', err);
        }
      });
  }

  // ==============================
  // MAP MONTH DATA
  // ==============================
  mapLast6Months(data: any[]): number[] {
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    const result = [0, 0, 0, 0, 0, 0];

    if (!data) return result;

    data.forEach(item => {
      const index = months.indexOf(item.month);
      if (index !== -1) {
        result[index] = item.count;
      }
    });

    return result;
  }

  // ==============================
  // RENDER CHARTS
  // ==============================
  renderCharts() {

    // Destroy old charts (important on reload)
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // ---- TOTAL LEADS ----
    this.charts.push(new Chart('totalLeads', {
      type: 'doughnut',
      data: {
        labels: ['Leads'],
        datasets: [{
          data: [this.totalLeads],
          backgroundColor: ['#1B84FF']
        }]
      }
    }));

    // ---- TOTAL CUSTOMERS ----
    this.charts.push(new Chart('totalCustomers', {
      type: 'doughnut',
      data: {
        labels: ['Customers'],
        datasets: [{
          data: [this.totalCustomers],
          backgroundColor: ['#22C55E']
        }]
      }
    }));

    // ---- LEAD STATUS ----
    this.charts.push(new Chart('leadsStatus', {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [this.activeLeads, this.inactiveLeads],
          backgroundColor: ['#1B84FF', '#E5E7EB']
        }]
      }
    }));

    // ---- CUSTOMER STATUS ----
    this.charts.push(new Chart('customersStatus', {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [this.activeCustomers, this.inactiveCustomers],
          backgroundColor: ['#22C55E', '#E5E7EB']
        }]
      }
    }));

    // ---- LEADS BY MONTH ----
    this.charts.push(new Chart('leadsMonth', {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Leads',
          data: this.leadsByMonth,
          backgroundColor: '#1B84FF'
        }]
      }
    }));

    // ---- CUSTOMERS BY MONTH ----
    this.charts.push(new Chart('customersMonth', {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Customers',
          data: this.customersByMonth,
          backgroundColor: '#22C55E'
        }]
      }
    }));

    // ---- LEADS VS CUSTOMERS ----
    this.charts.push(new Chart('leadsVsCustomers', {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [
          {
            label: 'Leads',
            data: this.leadsByMonth,
            borderColor: '#1B84FF',
            tension: 0.4
          },
          {
            label: 'Customers',
            data: this.customersByMonth,
            borderColor: '#22C55E',
            tension: 0.4
          }
        ]
      }
    }));
  }
}
