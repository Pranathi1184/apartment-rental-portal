import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-community-connect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-10 text-center">
        <h2 class="text-4xl font-extrabold text-indigo-900 mb-3 tracking-tight">Community Connect</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Find trusted local helpers recommended by your neighbors. 
          Verified maids, cooks, drivers, and more at your fingertips.
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-8 flex flex-wrap justify-center gap-4">
        <button 
          *ngFor="let type of serviceTypes"
          (click)="filterType(type)"
          class="px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-sm border"
          [ngClass]="selectedType() === type 
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-indigo-300'">
          {{ type === 'All' ? 'All Helpers' : type }}
        </button>
      </div>

      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>

      <div *ngIf="!loading() && filteredProviders().length === 0" class="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="text-6xl mb-4">🤷‍♂️</div>
        <p class="text-gray-500 text-xl font-medium">No helpers found for this category.</p>
        <button (click)="filterType('All')" class="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold underline">View all helpers</button>
      </div>

      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let provider of filteredProviders()" 
             class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
          
          <!-- Header / Avatar -->
          <div class="p-6 flex items-start gap-4 border-b border-gray-50 bg-gradient-to-br from-gray-50 to-white">
            <div class="relative">
                <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl shadow-inner text-indigo-600 font-bold border-2 border-white">
                    {{ provider.name.charAt(0) }}
                </div>
                <div *ngIf="provider.is_verified" class="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white" title="Verified">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div>
                <h3 class="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-700 transition-colors">{{ provider.name }}</h3>
                <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 mt-1">
                    {{ provider.service_type }}
                </span>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 flex-grow space-y-3">
             <div class="flex items-center justify-between">
                 <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                     <span class="text-yellow-500">⭐</span>
                     <span class="font-bold text-gray-800">{{ provider.rating }}</span>
                 </div>
                 <span class="text-xs text-gray-400 font-medium">Verified by Society</span>
             </div>
             
             <div class="flex items-center gap-2 text-gray-600 text-sm">
                 <span class="text-lg">🕒</span>
                 <span>{{ provider.availability }}</span>
             </div>

             <div class="flex items-center gap-2 text-gray-600 text-sm">
                 <span class="text-lg">📞</span>
                 <span>+91 {{ provider.phone_number }}</span>
             </div>
          </div>

          <!-- Footer / Action -->
          <div class="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
             <button (click)="contactProvider(provider)" 
                     class="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                 </svg>
                 Chat on WhatsApp
             </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CommunityConnectComponent implements OnInit {
  providers = signal<any[]>([]);
  filteredProviders = signal<any[]>([]);
  loading = signal<boolean>(true);
  selectedType = signal<string>('All');
  
  serviceTypes = ['All', 'Maid', 'Cook', 'Driver', 'Cleaner', 'Plumber', 'Electrician'];

  constructor(
    private api: ApiService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.loading.set(true);
    this.api.getServiceProviders().subscribe({
      next: (data) => {
        this.providers.set(data);
        this.filterType(this.selectedType());
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.notification.showError('Failed to load service providers');
        this.loading.set(false);
      }
    });
  }

  filterType(type: string) {
    this.selectedType.set(type);
    if (type === 'All') {
      this.filteredProviders.set(this.providers());
    } else {
      this.filteredProviders.set(this.providers().filter(p => p.service_type === type));
    }
  }

  contactProvider(provider: any) {
    // Open WhatsApp Link
    const message = `Hello ${provider.name}, I am a resident of Skyline Living. I found your contact on our community portal and would like to inquire about your services.`;
    const url = `https://wa.me/91${provider.phone_number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
