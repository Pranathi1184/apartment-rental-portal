import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <div class="text-gray-500 text-sm uppercase">Total Units</div>
          <div class="text-3xl font-bold">{{ stats()?.total_units || 0 }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <div class="text-gray-500 text-sm uppercase">Occupied</div>
          <div class="text-3xl font-bold">{{ stats()?.occupied_units || 0 }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
          <div class="text-gray-500 text-sm uppercase">Available</div>
          <div class="text-3xl font-bold">{{ stats()?.available_units || 0 }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-purple-500">
          <div class="text-gray-500 text-sm uppercase">Occupancy Rate</div>
          <div class="text-3xl font-bold">{{ stats()?.occupancy_rate || 0 }}%</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow">
          <h3 class="font-bold text-lg mb-2">Manage Users</h3>
          <p class="text-gray-600 mb-4">Create admins, residents, and service providers.</p>
          <a routerLink="/admin/users" class="text-blue-600 font-medium hover:underline">Go to User Management &rarr;</a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  api = inject(ApiService);
  stats = signal<any>(null);

  constructor(private router: Router) {
    this.api.getStats().subscribe(data => this.stats.set(data));
  }
}
