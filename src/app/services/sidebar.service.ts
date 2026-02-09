import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  public isCollapsed$ = this.isCollapsedSubject.asObservable();

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  toggleSidebar() {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }
}
