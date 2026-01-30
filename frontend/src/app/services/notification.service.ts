import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);
  private counter = 0;

  showSuccess(message: string) {
    this.add(message, 'success');
  }

  showError(message: string) {
    this.add(message, 'error');
  }

  showInfo(message: string) {
    this.add(message, 'info');
  }

  private add(message: string, type: 'success' | 'error' | 'info') {
    const id = this.counter++;
    this.notifications.update(current => [...current, { message, type, id }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }
}
