import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', canActivate: [authGuard], loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', canActivate: [authGuard], loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/products/products.component').then(m => m.ProductsComponent) },
      { path: 'products/new', loadComponent: () => import('./features/admin/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/product-form/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'categories', loadComponent: () => import('./features/admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'categories/new', loadComponent: () => import('./features/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('./features/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/orders.component').then(m => m.OrdersComponent) },
      { path: 'orders/:id', loadComponent: () => import('./features/admin/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
      { path: 'customers', loadComponent: () => import('./features/admin/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'customers/:id', loadComponent: () => import('./features/admin/customers/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'users/:id', loadComponent: () => import('./features/admin/users/user-detail/user-detail.component').then(m => m.UserDetailComponent) },
      { path: 'discounts', loadComponent: () => import('./features/admin/discounts/discounts.component').then(m => m.DiscountsComponent) },
      { path: 'discounts/:id', loadComponent: () => import('./features/admin/discounts/discount-detail/discount-detail.component').then(m => m.DiscountDetailComponent) },
      { path: 'reports', loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'profile', loadComponent: () => import('./features/admin/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'media-library', loadComponent: () => import('./features/admin/media-library/media-library.component').then(m => m.MediaLibraryComponent) }
    ]
  },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
