
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  activeTab: 'admin' | 'helper' | 'list' = 'admin';
  adminForm: FormGroup;
  helperForm: FormGroup;
  users: any[] = [];
  selectedUserId: string = '';
  
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private adminService: AdminService,
    public authService: AuthService
  ) {
    this.adminForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Resident', Validators.required], // Default to Resident for safety
      phone: ['']
    });

    this.helperForm = this.fb.group({
      name: ['', Validators.required],
      service_type: ['Maid', Validators.required],
      phone_number: ['', Validators.required],
      availability: ['9 AM - 6 PM']
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  switchTab(tab: 'admin' | 'helper' | 'list') {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    if (tab === 'list') {
        this.loadUsers();
    }
  }

  createAdmin() {
    if (this.adminForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    if (!confirm('Are you sure you want to create this user with elevated privileges?')) {
      return;
    }

    this.adminService.createUser(this.adminForm.value).subscribe({
      next: (res) => {
        this.successMessage = `User created successfully! ID: ${res.id}`;
        this.errorMessage = '';
        this.adminForm.reset({ role: 'Admin' });
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Failed to create user.';
        this.successMessage = '';
      }
    });
  }

  createHelper() {
    if (this.helperForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    if (!confirm('Are you sure you want to add this new helper?')) {
      return;
    }

    this.adminService.createServiceProvider(this.helperForm.value).subscribe({
      next: (res) => {
        this.successMessage = `Helper added successfully! ID: ${res.id}`;
        this.errorMessage = '';
        this.helperForm.reset({ service_type: 'Maid', availability: '9 AM - 6 PM' });
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Failed to add helper.';
        this.successMessage = '';
      }
    });
  }
}
