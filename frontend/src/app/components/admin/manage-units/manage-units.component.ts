import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-units',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 class="text-3xl font-bold text-gray-800">Manage Property</h2>
        
        <div class="flex gap-2">
           <button (click)="activeForm.set('tower')" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
             + Add Tower
           </button>
           <button (click)="activeForm.set('amenity')" class="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">
             + Add Amenity
           </button>
           <button (click)="activeForm.set('unit')" class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
             + Add Unit
           </button>
        </div>
      </div>

      <!-- Forms Section -->
      <div *ngIf="activeForm()" class="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8 relative">
        <button (click)="resetForm()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Tower Form -->
        <div *ngIf="activeForm() === 'tower'">
          <h3 class="text-xl font-bold mb-4 text-gray-800">Add New Tower</h3>
          <form [formGroup]="towerForm" (ngSubmit)="createTower()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tower Name</label>
                <input formControlName="name" type="text" placeholder="e.g. Tower C" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input formControlName="location" type="text" placeholder="e.g. East Wing" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>
            <button type="submit" [disabled]="towerForm.invalid" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">Create Tower</button>
          </form>
        </div>

        <!-- Amenity Form -->
        <div *ngIf="activeForm() === 'amenity'">
          <h3 class="text-xl font-bold mb-4 text-gray-800">Add New Amenity</h3>
          <form [formGroup]="amenityForm" (ngSubmit)="createAmenity()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amenity Name</label>
                <input formControlName="name" type="text" placeholder="e.g. Gym" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-purple-500 focus:border-purple-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select formControlName="category" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-purple-500 focus:border-purple-500">
                  <option value="UnitFeature">Unit Feature</option>
                  <option value="CommonArea">Common Area</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea formControlName="description" rows="2" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-purple-500 focus:border-purple-500"></textarea>
              </div>
              <div class="md:col-span-2" *ngIf="amenityForm.controls['category'].value === 'UnitFeature'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Assign to Unit (optional)</label>
                <select formControlName="unit_id" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-purple-500 focus:border-purple-500">
                  <option value="">-- Select Unit --</option>
                  <option *ngFor="let u of units()" [value]="u.id">{{ u.unit_number }} ({{ u.tower_name }})</option>
                </select>
                <p class="text-xs text-gray-500 mt-1">If selected, the amenity will be linked to this unit.</p>
              </div>
            </div>
            <button type="submit" [disabled]="amenityForm.invalid" class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50">Create Amenity</button>
          </form>
        </div>

        <!-- Unit Form -->
        <div *ngIf="activeForm() === 'unit'">
          <h3 class="text-xl font-bold mb-4 text-gray-800">{{ editingUnitId() ? 'Edit Unit' : 'Add New Unit' }}</h3>
          <form [formGroup]="unitForm" (ngSubmit)="saveUnit()">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tower</label>
                <select formControlName="tower_id" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500">
                  <option *ngFor="let t of towers()" [value]="t.id">{{ t.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
                <input formControlName="unit_number" type="text" placeholder="e.g. A-101" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input formControlName="floor" type="number" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Photo URLs (one per line)</label>
                 <textarea formControlName="photos" rows="3" placeholder="http://example.com/photo1.jpg" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500"></textarea>
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Nearby Places (one per line)</label>
                 <textarea formControlName="nearby_places" rows="3" placeholder="Central Park - 5 mins walk" class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500"></textarea>
               </div>
               <div class="md:col-span-2">
                 <label class="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                 <select formControlName="amenities" multiple class="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-green-500 focus:border-green-500 h-32">
                   <option *ngFor="let amenity of amenities()" [value]="amenity.id">{{ amenity.name }}</option>
                 </select>
                 <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
               </div>
            </div>

            <button type="submit" [disabled]="unitForm.invalid" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              {{ editingUnitId() ? 'Update Unit' : 'Save Unit' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Units Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-medium text-gray-900">Existing Units</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tower</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let unit of units()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{{ unit.unit_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ unit.tower_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ unit.floor }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'bg-green-100 text-green-800': unit.status === 'Vacant',
                  'bg-red-100 text-red-800': unit.status === 'Occupied',
                  'bg-gray-100 text-gray-800': unit.status === 'Maintenance'
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ unit.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="editUnit(unit)" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ManageUnitsComponent {
  api = inject(ApiService);
  notification = inject(NotificationService);
  fb = inject(FormBuilder);
  
  units = signal<any[]>([]);
  towers = signal<any[]>([]);
  amenities = signal<any[]>([]);
  activeForm = signal<'tower' | 'amenity' | 'unit' | null>(null);
  editingUnitId = signal<string | null>(null);

  unitForm = this.fb.group({
    tower_id: ['', Validators.required],
    unit_number: ['', Validators.required],
    floor: [1, Validators.required],
    photos: [''],
    nearby_places: [''],
    amenities: [[] as string[]]
  });

  towerForm = this.fb.group({
    name: ['', Validators.required],
    location: ['']
  });

  amenityForm = this.fb.group({
    name: ['', Validators.required],
    category: ['UnitFeature'],
    description: [''],
    unit_id: ['']
  });

  constructor() {
    this.loadData();
  }

  loadData() {
    this.api.getUnits().subscribe(data => this.units.set(data));
    this.api.getTowers().subscribe(data => this.towers.set(data));
    this.api.getAmenities().subscribe(data => this.amenities.set(data));
  }

  editUnit(unit: any) {
    this.editingUnitId.set(unit.id);
    this.unitForm.patchValue({
      tower_id: unit.tower_id,
      unit_number: unit.unit_number,
      floor: unit.floor,
      photos: unit.photos ? unit.photos.join('\n') : '',
      nearby_places: unit.nearby_places ? unit.nearby_places.join('\n') : '',
      amenities: unit.amenity_ids || []
    });
    this.activeForm.set('unit');
  }

  saveUnit() {
    if (this.unitForm.valid) {
      const val = this.unitForm.value;
      const payload = {
        ...val,
        photos: val.photos ? val.photos.split('\n').filter((s: string) => s.trim()) : [],
        nearby_places: val.nearby_places ? val.nearby_places.split('\n').filter((s: string) => s.trim()) : []
      };

      if (this.editingUnitId()) {
        this.api.updateUnit(this.editingUnitId()!, payload).subscribe({
          next: () => {
            this.notification.showSuccess('Unit updated successfully');
            this.resetForm();
          },
          error: () => this.notification.showError('Failed to update unit')
        });
      } else {
        this.api.createUnit(payload).subscribe({
          next: () => {
            this.notification.showSuccess('Unit created successfully');
            this.resetForm();
          },
          error: () => this.notification.showError('Failed to create unit')
        });
      }
    }
  }

  resetForm() {
    this.unitForm.reset({ floor: 1 });
    this.editingUnitId.set(null);
    this.activeForm.set(null);
    this.loadData();
  }

  createTower() {
    if (this.towerForm.valid) {
      this.api.createTower(this.towerForm.value).subscribe({
        next: () => {
          this.notification.showSuccess('Tower created successfully');
          this.towerForm.reset();
          this.loadData();
          this.activeForm.set(null);
        },
        error: () => this.notification.showError('Failed to create tower')
      });
    }
  }

  createAmenity() {
    if (this.amenityForm.valid) {
      const val = this.amenityForm.value;
      this.api.createAmenity({
        name: val.name,
        category: val.category,
        description: val.description
      }).subscribe({
        next: (res: any) => {
          const newAmenityId = res?.id;
          const unitId = val.unit_id;
          const isUnitFeature = val.category === 'UnitFeature';
          if (isUnitFeature && unitId && newAmenityId) {
            const unitExists = this.units().some(u => u.id === unitId);
            if (!unitExists) {
              this.notification.showError('Selected unit not found');
            } else {
              this.api.assignAmenity(unitId, newAmenityId).subscribe({
                next: () => {
                  this.notification.showSuccess('Amenity created and assigned to unit');
                  this.amenityForm.reset({ category: 'UnitFeature' });
                  this.activeForm.set(null);
                  this.loadData();
                },
                error: () => {
                  this.notification.showError('Amenity created, but failed to assign to unit');
                  this.amenityForm.reset({ category: 'UnitFeature' });
                  this.activeForm.set(null);
                  this.loadData();
                }
              });
              return;
            }
          }
          this.notification.showSuccess('Amenity created successfully');
          this.amenityForm.reset({ category: 'UnitFeature' });
          this.activeForm.set(null);
          this.loadData();
        },
        error: () => this.notification.showError('Failed to create amenity')
      });
    }
  }
}
