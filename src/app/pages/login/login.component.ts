import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    isLoading = false;

    constructor(
        private api: ApiService,
        private auth: AuthService
    ) { }

    onSubmit() {
        if (!this.username || !this.password) {
            this.error = 'Por favor complete todos los campos';
            return;
        }

        this.isLoading = true;
        this.error = '';

        this.api.login({ username: this.username, password: this.password }).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success) {
                    this.auth.login(res.token, res.admin);
                } else {
                    this.error = res.message || 'Error al iniciar sesión';
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Error de conexión';
            }
        });
    }
}
