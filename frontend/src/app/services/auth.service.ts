import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'auth_token';
  
  // Signals
  currentUser = signal<any>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  isSuperAdmin = computed(() => this.currentUser()?.is_super_admin === true);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Check for expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          this.logout();
          return;
        }
        this.currentUser.set(decoded);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: any) {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        const decoded: any = jwtDecode(response.access_token);
        // JWT decode usually gives 'sub' as identity.
        // My backend returns { identity: id, role: role } in claims.
        // Let's ensure backend claims are consistent.
        this.currentUser.set(decoded);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
