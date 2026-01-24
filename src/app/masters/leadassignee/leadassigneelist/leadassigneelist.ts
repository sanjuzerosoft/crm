import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leadassigneelist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leadassigneelist.html',
  styleUrls: ['./leadassigneelist.css'],
})
export class Leadassigneelist implements OnInit {

  assignees: any[] = [];
  allAssignees: any[] = []; 
  searchText: string = '';

  showDeletePopup = false;
  selectedAssigneeId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadAssignees();
  }

  loadAssignees() {
    this.assignees = [
      {
        id: 1,
        name: 'Ravi Kumar',
        email: 'ravi@test.com',
        mobile: '9876543210',
        role: 'Sales Executive',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@test.com',
        mobile: '9123456780',
        role: 'Telecaller',
        status: 'Inactive',
      },
      {
        id: 3,
        name: 'Arun Raj',
        email: 'arun@test.com',
        mobile: '9000011111',
        role: 'Sales Manager',
        status: 'Active',
      },
    ];

    this.allAssignees = [...this.assignees];
  }

  // 🔍 Search
  onSearch() {
    const value = this.searchText.toLowerCase();

    this.assignees = this.allAssignees.filter(
      (a) =>
        a.name.toLowerCase().includes(value) ||
        a.email.toLowerCase().includes(value) ||
        a.mobile.includes(value)
    );
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

  confirmDelete() {
    if (this.selectedAssigneeId !== null) {
      this.assignees = this.assignees.filter(
        (a) => a.id !== this.selectedAssigneeId
      );
      this.allAssignees = this.allAssignees.filter(
        (a) => a.id !== this.selectedAssigneeId
      );
    }
    this.closeDeletePopup();
  }
}
