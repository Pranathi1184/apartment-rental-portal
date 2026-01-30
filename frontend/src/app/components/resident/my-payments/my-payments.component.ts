import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Payment History</h2>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let payment of payments()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.date | date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.unit_number || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ payment.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ payment.amount | currency }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button (click)="downloadReceipt(payment)" class="text-indigo-600 hover:text-indigo-900 font-medium">
                  Download Receipt
                </button>
              </td>
            </tr>
            <tr *ngIf="payments().length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 italic">No payment history found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Payment Form -->
      <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Make a Payment</h3>
        <p class="text-sm text-gray-500 mb-6">Securely pay your rent online.</p>
        
        <div class="mb-4">
           <label class="block text-sm font-medium text-gray-700 mb-2">Select Unit to Pay For:</label>
           <select *ngIf="leases().length > 0" 
                   [ngModel]="selectedLeaseId()" 
                   (ngModelChange)="selectLease($event)"
                   class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border">
             <option *ngFor="let lease of leases()" [value]="lease.id">
               {{ lease.unit_number }} ({{ lease.tower_name }}) - Rent: {{ lease.rent_amount | currency }}
             </option>
           </select>
           <div *ngIf="leases().length === 0" class="text-sm text-red-500 italic">
             No active leases found. Please request a booking first.
           </div>
        </div>

        <div *ngIf="selectedLease()" class="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
          <p class="text-sm text-blue-800">
            <span class="font-bold">Summary:</span> Paying Rent for Unit {{ selectedLease().unit_number }}
          </p>
          <p class="text-sm text-blue-800 mt-1">
            <span class="font-bold">Due Date:</span> {{ getDueDate() | date }}
          </p>
          <p class="text-lg font-bold text-blue-900 mt-2">
            Amount: {{ selectedLease().rent_amount | currency }}
          </p>
        </div>

        <button (click)="makeMockPayment()" 
          [disabled]="!selectedLease()"
          [class.opacity-50]="!selectedLease()"
          class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm">
          Pay Rent Now
        </button>
      </div>
    </div>
  `
})
export class MyPaymentsComponent {
  api = inject(ApiService);
  notification = inject(NotificationService);
  
  payments = signal<any[]>([]);
  leases = signal<any[]>([]);
  selectedLeaseId = signal<string>('');
  
  // Derived helper
  get selectedLease() {
    return () => this.leases().find(l => l.id === this.selectedLeaseId());
  }

  constructor() {
    this.loadData();
  }

  loadData() {
    this.loadPayments();
    this.loadLeases();
  }

  loadPayments() {
    this.api.getPayments().subscribe(data => this.payments.set(data));
  }

  loadLeases() {
    this.api.getLeases().subscribe({
      next: (data) => {
        this.leases.set(data);
        if (data.length > 0) {
          this.selectedLeaseId.set(data[0].id);
        }
      },
      error: () => {
        // Silently fail or show info if no leases
        this.leases.set([]);
      }
    });
  }
  
  selectLease(id: string) {
    this.selectedLeaseId.set(id);
  }

  makeMockPayment() {
    const lease = this.selectedLease();
    if (lease) {
      this.api.makePayment({
        lease_id: lease.id,
        amount: lease.rent_amount,
        type: 'Rent'
      }).subscribe({
        next: () => {
          this.notification.showSuccess(`Payment of $${lease.rent_amount} for Unit ${lease.unit_number} successful!`);
          this.loadPayments();
        },
        error: (err) => {
          this.notification.showError('Payment failed. Please try again.');
        }
      });
    }
  }

  getDueDate(): Date {
    const now = new Date();
    // Due date is always the 5th of the current month
    return new Date(now.getFullYear(), now.getMonth(), 5);
  }

  downloadReceipt(payment: any) {
    const receiptContent = `
      SKYLINE LIVING - PAYMENT RECEIPT
      --------------------------------
      Date: ${new Date(payment.date).toLocaleDateString()}
      Receipt ID: ${payment.id}
      Unit: ${payment.unit_number || 'N/A'}
      Type: ${payment.type}
      Status: ${payment.status}
      
      AMOUNT PAID: $${payment.amount}
      --------------------------------
      Thank you for your payment!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${payment.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.notification.showSuccess('Receipt downloaded successfully');
  }
}
