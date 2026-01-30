import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 mb-2">First Name</label>
            <input formControlName="first_name" class="w-full p-2 border rounded">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">Last Name</label>
            <input formControlName="last_name" class="w-full p-2 border rounded">
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input formControlName="email" type="email" class="w-full p-2 border rounded">
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Password</label>
          <input formControlName="password" type="password" class="w-full p-2 border rounded">
        </div>

        <div *ngIf="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>

        <button type="submit" [disabled]="registerForm.invalid" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
          Register
        </button>
      </form>
      <div class="mt-4 text-center text-sm">
        Already have an account? <a routerLink="/login" class="text-blue-600 hover:underline">Login</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  
  registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Resident'] // Default
  });
  
  error = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.msg || 'Registration failed';
        }
      });
    }
  }
}
