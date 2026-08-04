import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DashboardService, KPICard, QuickAction } from '../services/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private kpiCardsSignal = signal<KPICard[]>([]);
  private quickActionsSignal = signal<QuickAction[]>([]);
  private loadingSignal = signal<boolean>(false);

  readonly kpiCards = this.kpiCardsSignal.asReadonly();
  readonly quickActions = this.quickActionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private dashboardService: DashboardService) {}

  loadDashboardData(): Observable<KPICard[]> {
    this.loadingSignal.set(true);
    return this.dashboardService.getKPICards().pipe(
      tap(data => {
        this.kpiCardsSignal.set(data);
        this.loadingSignal.set(false);
      })
    );
  }

  loadQuickActions(): Observable<QuickAction[]> {
    return this.dashboardService.getQuickActions().pipe(
      tap(data => {
        this.quickActionsSignal.set(data);
      })
    );
  }

  refreshData(): void {
    this.loadDashboardData().subscribe();
  }
}
