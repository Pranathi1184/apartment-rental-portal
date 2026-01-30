import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input formControlName="email" type="email" class="w-full p-2 border rounded" placeholder="admin@example.com">
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Password</label>
          <input formControlName="password" type="password" class="w-full p-2 border rounded" placeholder="******">
        </div>

        <div *ngIf="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>

        <button type="submit" [disabled]="loginForm.invalid" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
          Login
        </button>
      </form>
      <div class="mt-4 text-center text-sm">
        Don't have an account? <a routerLink="/register" class="text-blue-600 hover:underline">Register</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: () => {
          if (this.auth.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/browse']);
          }
        },
        error: (err) => {
          this.error = 'Invalid credentials';
        }
      });
    }
  }
}
