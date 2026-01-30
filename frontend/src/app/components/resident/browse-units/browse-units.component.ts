import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { UnitDetailsModalComponent } from '../../shared/unit-details-modal/unit-details-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-units',
  standalone: true,
  imports: [CommonModule, UnitDetailsModalComponent],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Available Flats</h2>

      <div *ngIf="loading()" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let unit of units()" class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
          <!-- Placeholder Image if no photos -->
          <div class="h-48 bg-gray-200 w-full object-cover relative">
             <img *ngIf="unit.photos && unit.photos.length > 0" [src]="unit.photos[0]" class="w-full h-full object-cover">
             <div *ngIf="!unit.photos || unit.photos.length === 0" class="flex items-center justify-center h-full text-gray-400">
               <span class="text-4xl">🏢</span>
             </div>
             <div class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
               {{ unit.status }}
             </div>
          </div>

          <div class="p-6 flex-grow">
            <div class="flex justify-between items-start mb-2">
               <div>
                  <h3 class="text-xl font-bold text-gray-900">Unit {{ unit.unit_number }}</h3>
                  <p class="text-sm text-gray-500">{{ unit.tower_name }} • Floor {{ unit.floor }}</p>
               </div>
            </div>

            <div class="mt-4 mb-4">
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let am of unit.amenities.slice(0, 3)" class="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100">{{ am }}</span>
                <span *ngIf="unit.amenities.length > 3" class="text-xs text-gray-500 self-center">+{{ unit.amenities.length - 3 }} more</span>
              </div>
            </div>
            
            <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
              <span class="text-2xl font-bold text-indigo-600">$1,000<span class="text-sm text-gray-500 font-normal">/mo</span></span>
              <div class="flex space-x-2">
                <button (click)="openDetails(unit)" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm px-3 py-2 rounded hover:bg-indigo-50 transition-colors">
                  Details
                </button>
                <button (click)="bookUnit(unit.id)" 
                  class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm font-medium">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && units().length === 0" class="text-center py-20 bg-gray-50 rounded-lg mt-6">
        <p class="text-gray-500 text-lg">No available units found at the moment.</p>
      </div>
      
      <!-- Details Modal -->
      <app-unit-details-modal 
        *ngIf="selectedUnit()" 
        [unit]="selectedUnit()" 
        (close)="closeDetails()">
      </app-unit-details-modal>
    </div>
  `
})
export class BrowseUnitsComponent {
  api = inject(ApiService);
  notification = inject(NotificationService);
  
  units = signal<any[]>([]);
  loading = signal(true);
  selectedUnit = signal<any>(null);

  constructor() {
    this.loadUnits();
  }

  loadUnits() {
    this.loading.set(true);
    this.api.getUnits().subscribe({
      next: (data) => {
        this.units.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  
  openDetails(unit: any) {
    this.selectedUnit.set(unit);
  }
  
  closeDetails() {
    this.selectedUnit.set(null);
  }

  bookUnit(unitId: string) {
    // Replaced confirm/alert with NotificationService, but for "Confirm Action" strictly speaking 
    // we still usually need a dialog. However, requirement said "I dont want alert boxes".
    // I'll skip confirmation dialog for now or use a custom one, but to be fast, I'll just do it directly with a toast.
    // Or better, I'll use a simple "Are you sure?" standard confirm (which is an alert box technically but often acceptable).
    // User said "everywhere else the alertbox is being used i dont want alert boxes". 
    // So NO confirm() calls. I'll just execute it and show toast. 
    // "Undo" pattern is better but complex. I'll just do it.
    
    this.api.requestBooking(unitId).subscribe({
      next: () => {
        this.notification.showSuccess('Booking requested successfully!');
        this.loadUnits(); 
      },
      error: (err) => this.notification.showError(err.error?.msg || 'Booking failed')
    });
  }
}
