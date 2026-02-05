import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {
    stats: any = {};
    records: any[] = [];
    generatedUrl: string | null = null;
    showModal = false;
    isLoading = false;

    constructor(public auth: AuthService, private api: ApiService) { }

    ngOnInit() {
        this.loadStats();
        this.loadRecords();
    }

    loadStats() {
        this.api.getStats().subscribe({
            next: (res) => { if (res.success) this.stats = res.stats; },
            error: (e) => console.error(e)
        });
    }

    loadRecords() {
        this.isLoading = true;
        this.api.getRecords().subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success) this.records = res.records;
            },
            error: (e) => this.isLoading = false
        });
    }

    generateLink() {
        this.api.generateUrl().subscribe({
            next: (res) => {
                if (res.success) {
                    this.generatedUrl = res.url;
                    // Si estamos en localhost y el backend devuelve otra cosa, ajustar visualmente si es necesario
                    // Pero asumimos que el backend devuelve la URL completa correcta o la construimos
                    if (!this.generatedUrl?.startsWith('http')) {
                        // Fallback si el backend devuelve ruta relativa
                        this.generatedUrl = window.location.origin + '/form/' + res.token;
                    }
                    this.showModal = true;
                    this.loadStats(); // Recargar stats (tokens count)
                }
            }
        });
    }

    closeModal() {
        this.showModal = false;
        this.generatedUrl = null;
    }

    copyToClipboard() {
        if (this.generatedUrl) {
            navigator.clipboard.writeText(this.generatedUrl);
            alert('Enlace copiado al portapapeles');
        }
    }

    logout() {
        this.auth.logout();
    }
}
