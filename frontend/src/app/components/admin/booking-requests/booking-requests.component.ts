import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-6">Booking Requests</h2>

      <div class="bg-white rounded shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let booking of bookings()">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ booking.user_email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ booking.type }}: {{ booking.target_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ booking.start_time | date:'shortDate' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'bg-yellow-100 text-yellow-800': booking.status === 'Pending',
                  'bg-green-100 text-green-800': booking.status === 'Approved',
                  'bg-red-100 text-red-800': booking.status === 'Rejected'
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ booking.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ng-container *ngIf="booking.status === 'Pending'">
                  <button (click)="approve(booking.id)" class="text-green-600 hover:text-green-900 mr-4">Approve</button>
                  <button (click)="reject(booking.id)" class="text-red-600 hover:text-red-900">Reject</button>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookingRequestsComponent {
  api = inject(ApiService);
  notification = inject(NotificationService);
  bookings = signal<any[]>([]);

  constructor() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getBookings().subscribe(data => this.bookings.set(data));
  }

  approve(id: string) {
    if (confirm('Approve this booking? This will create a lease and occupy the unit.')) {
      this.api.approveBooking(id).subscribe({
        next: () => {
          this.notification.showSuccess('Booking approved.');
          this.loadBookings();
        },
        error: (err) => this.notification.showError(err.error?.msg || 'Failed to approve')
      });
    }
  }

  reject(id: string) {
    if (confirm('Reject this booking?')) {
      this.api.rejectBooking(id).subscribe({
        next: () => {
          this.notification.showSuccess('Booking rejected.');
          this.loadBookings();
        },
        error: () => this.notification.showError('Failed to reject')
      });
    }
  }
}
