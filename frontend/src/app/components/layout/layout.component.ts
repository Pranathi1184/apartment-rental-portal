import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
      <nav class="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
          <a routerLink="/" class="text-2xl font-bold tracking-tight flex items-center gap-2 group">
            <span class="text-3xl group-hover:rotate-12 transition-transform duration-300">🏢</span>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">SkyLine Living</span>
          </a>
          
          <div class="flex space-x-6 items-center">
            <ng-container *ngIf="auth.isAuthenticated()">
              
              <!-- Resident Links -->
              <ng-container *ngIf="!auth.isAdmin()">
                <a routerLink="/browse" class="nav-link">Browse Flats</a>
                <a routerLink="/my-bookings" class="nav-link">My Bookings</a>
                <a routerLink="/my-payments" class="nav-link">My Payments</a>
                <a routerLink="/community-connect" class="nav-link flex items-center gap-1">
                  <span class="text-lg">🤝</span> Community Connect
                </a>
              </ng-container>

              <!-- Admin Links -->
              <ng-container *ngIf="auth.isAdmin()">
                <a routerLink="/admin/dashboard" class="nav-link">Dashboard</a>
                <a routerLink="/admin/units" class="nav-link">Units</a>
                <a routerLink="/admin/bookings" class="nav-link">Bookings</a>
                <a routerLink="/admin/payments" class="nav-link">Payments</a>
                <a routerLink="/admin/users" class="nav-link">Users</a>
              </ng-container>

              <button (click)="logout()" class="bg-red-500 bg-opacity-90 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm font-medium">
                <span>Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </ng-container>
            
            <ng-container *ngIf="!auth.isAuthenticated()">
              <a routerLink="/" class="nav-link">Home</a>
              <a href="#features" class="nav-link">Features</a>
              <a href="#" class="nav-link">About</a>
              <a href="#" class="nav-link">Contact</a>
              <div class="h-6 w-px bg-gray-300 mx-2"></div>
              <a routerLink="/login" class="nav-link">Login</a>
              <a routerLink="/register" class="bg-white text-indigo-700 px-5 py-2 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300">Register</a>
            </ng-container>
          </div>
        </div>
      </nav>

      <main class="flex-grow container mx-auto px-4 py-8 animate-fade-in-up">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
        <div class="container mx-auto">
           <p class="mb-2">&copy; 2024 SkyLine Living Portal. All rights reserved.</p>
           <p class="text-xs text-gray-600">Designed for modern living.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .nav-link {
      @apply hover:text-indigo-200 transition-colors duration-200 font-medium relative py-1;
    }
    .nav-link::after {
      content: '';
      @apply absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 transition-all duration-300;
    }
    .nav-link:hover::after {
      @apply w-full;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `]
})
export class LayoutComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
