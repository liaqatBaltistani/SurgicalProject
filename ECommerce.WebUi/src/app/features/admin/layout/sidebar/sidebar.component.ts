import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface MenuItem {
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  badge?: number;
}

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;
  @Input() menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Categories', icon: 'category', path: '/admin/categories' },
    { label: 'Orders', icon: 'shopping_cart', path: '/admin/orders' },
    { label: 'Customers', icon: 'people', path: '/admin/customers' },
    { label: 'Users', icon: 'admin_panel_settings', path: '/admin/users' },
    { label: 'Discounts', icon: 'local_offer', path: '/admin/discounts' },
    { label: 'Reports', icon: 'analytics', path: '/admin/reports' },
    { label: 'Settings', icon: 'settings', path: '/admin/settings' },
    { label: 'Profile', icon: 'account_circle', path: '/admin/profile' }
  ];

  @Output() toggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  expandedItems: Set<string> = new Set();

  constructor(private router: Router) {}

  onToggle(): void {
    this.toggle.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  toggleExpand(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      if (this.expandedItems.has(item.label)) {
        this.expandedItems.delete(item.label);
      } else {
        this.expandedItems.add(item.label);
      }
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.label);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }
}
