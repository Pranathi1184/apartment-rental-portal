import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Stats
  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Towers
  getTowers() {
    return this.http.get<any[]>(`${this.apiUrl}/towers`);
  }
  
  createTower(data: any) {
    return this.http.post(`${this.apiUrl}/towers`, data);
  }

  // Units
  getUnits() {
    return this.http.get<any[]>(`${this.apiUrl}/units`);
  }
  
  createUnit(data: any) {
    return this.http.post(`${this.apiUrl}/units`, data);
  }

  updateUnit(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/units/${id}`, data);
  }

  // Amenities
  getAmenities() {
    return this.http.get<any[]>(`${this.apiUrl}/amenities`);
  }

  createAmenity(data: any) {
    return this.http.post(`${this.apiUrl}/amenities`, data);
  }

  assignAmenity(unitId: string, amenityId: string) {
    return this.http.post(`${this.apiUrl}/units/${unitId}/amenities`, { amenity_id: amenityId });
  }

  // Bookings
  getBookings() {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`);
  }

  requestBooking(unitId: string) {
    return this.http.post(`${this.apiUrl}/bookings`, { unit_id: unitId });
  }

  approveBooking(id: string) {
    return this.http.put(`${this.apiUrl}/bookings/${id}/approve`, {});
  }

  rejectBooking(id: string) {
    return this.http.put(`${this.apiUrl}/bookings/${id}/reject`, {});
  }

  // Leases
  getCurrentLease() {
    return this.http.get<any>(`${this.apiUrl}/leases/current`);
  }

  getLeases() {
    return this.http.get<any[]>(`${this.apiUrl}/leases`);
  }

  // Payments
  getPayments() {
    return this.http.get<any[]>(`${this.apiUrl}/payments`);
  }

  makePayment(data: any) {
    return this.http.post(`${this.apiUrl}/payments`, data);
  }

  // Tenants
  getTenants() {
    return this.http.get<any[]>(`${this.apiUrl}/tenants`);
  }

  // Community Connect
  getServiceProviders(type?: string) {
    let url = `${this.apiUrl}/service-providers`;
    if (type) {
        url += `?type=${type}`;
    }
    return this.http.get<any[]>(url);
  }
}
