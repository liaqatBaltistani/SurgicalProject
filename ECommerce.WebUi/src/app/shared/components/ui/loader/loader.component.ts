import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderType = 'spinner' | 'skeleton' | 'dots';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  size = input<LoaderSize>('md');
  type = input<LoaderType>('spinner');
  fullScreen = input(false);
  text = input<string>('');
}
