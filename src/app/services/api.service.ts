import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://iglesia-back-fichas-9os3qe:3000/api';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('adminToken');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

    // Auth
    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/login`, credentials);
    }

    // Admin: Tokens/Links
    generateUrl(): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/generate-url`, {}, { headers: this.getHeaders() });
    }

    getTokens(status?: string): Observable<any> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        return this.http.get(`${this.apiUrl}/admin/tokens`, { headers: this.getHeaders(), params });
    }

    // Admin: Records
    getRecords(page = 1, limit = 20): Observable<any> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get(`${this.apiUrl}/admin/records`, { headers: this.getHeaders(), params });
    }

    getRecord(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/records/${id}`, { headers: this.getHeaders() });
    }

    // Admin: Stats
    getStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/stats`, { headers: this.getHeaders() });
    }

    // Public: Form
    validateToken(token: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/form/validate/${token}`);
    }

    submitForm(token: string, data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/form/${token}`, data);
    }
}
