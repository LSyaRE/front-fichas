import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MedicalFormComponent } from './pages/medical-form/medical-form.component';
import { ViewRecordComponent } from './pages/view-record/view-record.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Admin Routes
    { path: 'admin/login', component: LoginComponent },
    {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/records/:id',
        component: ViewRecordComponent,
        canActivate: [authGuard]
    },

    // Public Form Route
    { path: 'form/:token', component: MedicalFormComponent },

    // Default
    { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'admin/login' }
];
