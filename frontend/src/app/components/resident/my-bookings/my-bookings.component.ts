import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">My Bookings</h2>

      <div class="bg-white rounded shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit/Target</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let booking of bookings()">
              <td class="px-6 py-4 whitespace-nowrap">{{ booking.type || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">{{ booking.target_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ booking.start_time | date:'shortDate' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ booking.end_time | date:'shortDate' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'bg-yellow-100 text-yellow-800': booking.status === 'Pending',
                  'bg-green-100 text-green-800': booking.status === 'Approved' || booking.status === 'Confirmed',
                  'bg-red-100 text-red-800': booking.status === 'Rejected' || booking.status === 'Cancelled'
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ booking.status === 'Approved' ? 'Occupied' : booking.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="bookings().length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">No bookings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MyBookingsComponent {
  api = inject(ApiService);
  bookings = signal<any[]>([]);

  constructor() {
    this.api.getBookings().subscribe(data => this.bookings.set(data));
  }
}
