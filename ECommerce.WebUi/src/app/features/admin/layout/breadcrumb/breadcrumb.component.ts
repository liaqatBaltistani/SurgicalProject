import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'admin-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.items.length === 0) {
      this.generateFromRoute();
    }
  }

  private generateFromRoute(): void {
    const urlSegments = this.route.snapshot.url.map(segment => segment.path);
    this.items = urlSegments.map((segment, index) => ({
      label: this.formatLabel(segment),
      path: index === urlSegments.length - 1 ? undefined : '/' + urlSegments.slice(0, index + 1).join('/')
    }));
  }

  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  navigate(path: string): void {
    if (path) {
      this.router.navigate([path]);
    }
  }

  isLast(item: BreadcrumbItem): boolean {
    return this.items[this.items.length - 1] === item;
  }
}
