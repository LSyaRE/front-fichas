import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Using check for basic reactivity, though localStorage is source of truth for persistence
    currentUser = signal<any>(null);

    constructor(private router: Router) {
        this.checkAuth();
    }

    checkAuth() {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        if (token && user) {
            this.currentUser.set(JSON.parse(user));
        }
    }

    login(token: string, admin: any) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        this.currentUser.set(admin);
        this.router.navigate(['/admin/dashboard']);
    }

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        this.currentUser.set(null);
        this.router.navigate(['/admin/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('adminToken');
    }

    getToken(): string | null {
        return localStorage.getItem('adminToken');
    }
}
