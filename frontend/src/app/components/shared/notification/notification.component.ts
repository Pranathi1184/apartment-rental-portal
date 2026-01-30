import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <div *ngFor="let n of notificationService.notifications()" 
           [class]="'px-4 py-3 rounded shadow-lg text-white transition-all transform ' + 
                    (n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500')">
        <div class="flex justify-between items-center gap-4">
          <span>{{ n.message }}</span>
          <button (click)="notificationService.remove(n.id)" class="text-white hover:text-gray-200">&times;</button>
        </div>
      </div>
    </div>
  `
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
