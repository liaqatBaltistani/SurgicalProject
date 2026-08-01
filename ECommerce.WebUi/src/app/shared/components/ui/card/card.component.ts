import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  padding = input<'sm' | 'md' | 'lg'>('md');
  elevation = input<boolean>(true);
  hoverable = input<boolean>(true);
  clickable = input(false);
  clicked = input<(() => void) | undefined>(undefined);
}
