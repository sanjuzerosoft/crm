import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {

  // === COUNTS ===
  totalLeads = 350;
  totalCustomers = 220;

  activeLeads = 280;
  inactiveLeads = 70;

  activeCustomers = 180;
  inactiveCustomers = 40;

  leadsByMonth = [40, 55, 70, 60, 80, 90];
  customersByMonth = [20, 30, 45, 40, 55, 60];

  get totalLeadsByMonth() {
    return this.leadsByMonth.reduce((a, b) => a + b, 0);
  }

  get totalCustomersByMonth() {
    return this.customersByMonth.reduce((a, b) => a + b, 0);
  }

  ngAfterViewInit() {

    new Chart('totalLeads', {
      type: 'doughnut',
      data: {
        labels: ['Leads'],
        datasets: [{
          data: [this.totalLeads],
          backgroundColor: ['#1B84FF']
        }]
      }
    });

    new Chart('totalCustomers', {
      type: 'doughnut',
      data: {
        labels: ['Customers'],
        datasets: [{
          data: [this.totalCustomers],
          backgroundColor: ['#22C55E']
        }]
      }
    });

    new Chart('leadsStatus', {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [this.activeLeads, this.inactiveLeads],
          backgroundColor: ['#1B84FF', '#E5E7EB']
        }]
      }
    });

    new Chart('customersStatus', {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        
        datasets: [{
          data: [this.activeCustomers, this.inactiveCustomers],
          backgroundColor: ['#22C55E', '#E5E7EB']
        }]
      }
    });

    new Chart('leadsMonth', {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Leads',
          data: this.leadsByMonth,
          backgroundColor: '#1B84FF'
        }]
      }
    });

    new Chart('customersMonth', {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Customers',
          data: this.customersByMonth,
          backgroundColor: '#22C55E'
        }]
      }
    });

    new Chart('leadsVsCustomers', {
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
    });

  }
}
