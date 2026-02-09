import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  isCollapsed = false;
  private subscription: Subscription = new Subscription();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.subscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
