
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { BrowseUnitsComponent } from './components/resident/browse-units/browse-units.component';
import { MyBookingsComponent } from './components/resident/my-bookings/my-bookings.component';
import { MyPaymentsComponent } from './components/resident/my-payments/my-payments.component';
import { CommunityConnectComponent } from './components/resident/community-connect/community-connect.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ManageUnitsComponent } from './components/admin/manage-units/manage-units.component';
import { BookingRequestsComponent } from './components/admin/booking-requests/booking-requests.component';
import { AllPaymentsComponent } from './components/admin/all-payments/all-payments.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      
      // Resident Routes
      { 
        path: 'browse', 
        component: BrowseUnitsComponent, 
        canActivate: [authGuard] 
      },
      { 
        path: 'my-bookings', 
        component: MyBookingsComponent, 
        canActivate: [authGuard] 
      },
      { 
        path: 'my-payments', 
        component: MyPaymentsComponent, 
        canActivate: [authGuard] 
      },
      { 
        path: 'community-connect', 
        component: CommunityConnectComponent, 
        canActivate: [authGuard] 
      },

      // Admin Routes
      { 
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'units', component: ManageUnitsComponent },
            { path: 'bookings', component: BookingRequestsComponent },
            { path: 'payments', component: AllPaymentsComponent },
            { path: 'users', component: UserManagementComponent }
        ]
      }
    ]
  }
];
