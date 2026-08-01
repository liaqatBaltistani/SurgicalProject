import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Our Story', path: '/about/story' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/blog' }
  ];

  customerServiceLinks = [
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Returns', path: '/returns' },
    { label: 'Shipping', path: '/shipping' }
  ];

  quickLinks = [
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Offers', path: '/offers' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms', path: '/terms' }
  ];

  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Instagram', icon: 'instagram', url: '#' },
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
    { name: 'Twitter', icon: 'twitter', url: '#' },
    { name: 'YouTube', icon: 'youtube', url: '#' }
  ];

  newsletterEmail = '';
}
