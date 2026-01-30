import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unit-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="close.emit()"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-2xl leading-6 font-medium text-gray-900" id="modal-title">
                  Unit {{ unit.unit_number }} Details
                </h3>
                <p class="text-sm text-gray-500 mb-4">{{ unit.tower_name }} - Floor {{ unit.floor }}</p>
                
                <!-- Photos Section -->
                <div class="mb-6">
                  <h4 class="font-bold text-gray-700 mb-2">Photos</h4>
                  <div *ngIf="unit.photos && unit.photos.length > 0; else noPhotos" class="grid grid-cols-2 gap-2">
                     <img *ngFor="let photo of unit.photos" [src]="photo" class="w-full h-32 object-cover rounded shadow-sm">
                  </div>
                  <ng-template #noPhotos>
                    <div class="bg-gray-100 p-4 rounded text-center text-gray-500 italic">No photos available</div>
                  </ng-template>
                </div>

                <!-- Nearby Places Section -->
                <div class="mb-6">
                  <h4 class="font-bold text-gray-700 mb-2">Nearby Places</h4>
                  <div *ngIf="unit.nearby_places && unit.nearby_places.length > 0; else noPlaces">
                     <ul class="list-disc pl-5 text-sm text-gray-600 space-y-1">
                       <li *ngFor="let place of unit.nearby_places">{{ place }}</li>
                     </ul>
                  </div>
                  <ng-template #noPlaces>
                    <div class="bg-gray-100 p-4 rounded text-center text-gray-500 italic">No nearby places listed</div>
                  </ng-template>
                </div>

                <!-- Amenities Section -->
                <div class="mb-6">
                  <h4 class="font-bold text-gray-700 mb-2">Amenities</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let am of unit.amenities" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {{ am }}
                    </span>
                    <span *ngIf="!unit.amenities || unit.amenities.length === 0" class="text-gray-500 text-sm italic">None</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" (click)="close.emit()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnitDetailsModalComponent {
  @Input() unit: any;
  @Output() close = new EventEmitter<void>();
}
