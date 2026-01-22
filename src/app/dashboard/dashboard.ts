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

  // ==============================
  // TOTAL GETTERS (USED IN HTML)
  // ==============================
  get totalLeadsByMonth(): number {
    return this.leadsByMonth.reduce((sum, val) => sum + val, 0);
  }

  get totalCustomersByMonth(): number {
    return this.customersByMonth.reduce((sum, val) => sum + val, 0);
  }

  // ==============================
  // API DATA
  // ==============================
  totalLeads = 0;
  totalCustomers = 0;

  activeLeads = 0;
  inactiveLeads = 0;

  activeCustomers = 0;
  inactiveCustomers = 0;

  leadsByMonth: number[] = new Array(12).fill(0);
  customersByMonth: number[] = new Array(12).fill(0);

  // ==============================
  // CHART REFERENCES
  // ==============================
  charts: Chart[] = [];

  readonly MONTH_LABELS = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

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

          // ---- MONTHLY DATA (12 MONTHS) ----
          this.leadsByMonth = this.mapMonths(res.leads_last_12_months);
          this.customersByMonth = this.mapMonths(res.customers_last_12_months);

          this.cdr.detectChanges();
          this.renderCharts();
        },
        error: (err) => {
          console.error('Dashboard API Error:', err);
        }
      });
  }

  // ==============================
  // MAP MONTH DATA (JAN–DEC)
  // ==============================
  mapMonths(data: any[]): number[] {
    const result = new Array(12).fill(0);

    if (!data) return result;

    data.forEach(item => {
      const index = this.MONTH_LABELS.indexOf(item.month);
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

    // Destroy old charts
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
        labels: this.MONTH_LABELS,
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
        labels: this.MONTH_LABELS,
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
        labels: this.MONTH_LABELS,
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
