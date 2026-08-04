import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../../services/auth.service';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('shrink', [
      transition('expanded => shrunk', [
        style({ height: '64px' }),
        animate('200ms ease-out', style({ height: '56px' }))
      ]),
      transition('shrunk => expanded', [
        style({ height: '56px' }),
        animate('200ms ease-out', style({ height: '64px' }))
      ])
    ])
  ]
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  cartItemCount = computed(() => this.cartService.cartCount());

  currentUser = computed(() => this.authService.getCurrentUser());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => {
    const user = this.authService.getCurrentUser();
    return user && (user.role === 'Admin' || user.role === 'admin');
  });

  navigationLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Products', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  adminLink = { label: 'Admin Panel', path: '/admin' };

  constructor() {
    this.handleScroll();
    this.loadCartCount();
  }

  private handleScroll(): void {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    });
  }

  private loadCartCount(): void {
    if (this.isLoggedIn()) {
      this.cartService.getCart().subscribe();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logoutClient();
    this.router.navigate(['/login']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
