import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../shared/components/stat-card/stat-card.component';
import { NotificationService } from '../../../core/services/notification.service';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, PageHeaderComponent, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardStore = inject(DashboardStore);
  private notificationService = inject(NotificationService);

  kpiCards = this.dashboardStore.kpiCards;
  quickActions = this.dashboardStore.quickActions;
  loading = this.dashboardStore.loading;

  ngOnInit(): void {
    this.dashboardStore.loadDashboardData().subscribe();
    this.dashboardStore.loadQuickActions().subscribe();
  }
}
