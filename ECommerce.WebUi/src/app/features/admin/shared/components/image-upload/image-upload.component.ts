import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ImageFile {
  file: File;
  url: string;
  id: string;
}

@Component({
  selector: 'admin-image-upload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() images: ImageFile[] = [];
  @Input() maxImages: number = 5;
  @Input() maxSize: number = 5; // MB
  @Input() acceptedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'];
  @Input() loading: boolean = false;

  @Output() imagesChange = new EventEmitter<ImageFile[]>();
  @Output() imageRemove = new EventEmitter<string>();
  @Output() imageReorder = new EventEmitter<ImageFile[]>();

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
    input.value = '';
  }

  handleFiles(files: FileList): void {
    const validFiles = Array.from(files).filter(file => {
      if (!this.acceptedTypes.includes(file.type)) {
        return false;
      }
      if (file.size > this.maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (this.images.length + validFiles.length > this.maxImages) {
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageFile = {
          file,
          url: e.target?.result as string,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        this.images = [...this.images, newImage];
        this.imagesChange.emit(this.images);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(id: string): void {
    this.images = this.images.filter(img => img.id !== id);
    this.imagesChange.emit(this.images);
    this.imageRemove.emit(id);
  }

  setPrimaryImage(id: string): void {
    const primaryImage = this.images.find(img => img.id === id);
    if (primaryImage) {
      const otherImages = this.images.filter(img => img.id !== id);
      this.images = [primaryImage, ...otherImages];
      this.imagesChange.emit(this.images);
      this.imageReorder.emit(this.images);
    }
  }

  isPrimary(id: string): boolean {
    return this.images.length > 0 && this.images[0].id === id;
  }

  canAddMore(): boolean {
    return this.images.length < this.maxImages && !this.loading;
  }
}
