import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-medical-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './medical-form.component.html',
    styles: []
})
export class MedicalFormComponent implements OnInit {
    @Input() token: string = '';
    form!: FormGroup;
    isValidToken = false;
    isLoading = true;
    isSubmitting = false;
    error = '';
    success = false;

    // Options
    diseasesList = [
        'Varicela', 'Meningitis', 'Hepatitis', 'Dengue', 'Neumonía', 'Malaria',
        'Fiebre amarilla', 'H1N1', 'COVID-19', 'Cólera', 'Rubéola', 'Sarampión',
        'Tétanos', 'Viruela', 'Tos ferina', 'Difteria', 'Paperas'
    ];

    disabilitiesList = [
        'Física', 'Visual', 'Auditiva', 'Del habla', 'Intelectual', 'Psíquica', 'Autismo', 'Ninguna'
    ];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private router: Router
    ) { }

    ngOnInit() {
        this.initForm();
        if (this.token) {
            this.validateToken();
        } else {
            this.error = 'Token no proporcionado';
            this.isLoading = false;
        }
    }

    initForm() {
        this.form = this.fb.group({
            // Info General
            nombre: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            sexo: ['', Validators.required],
            funcion: ['', Validators.required],
            estadoCivil: ['', Validators.required],

            // Plan Salud
            planSalud: [''],
            nombrePlan: [''],
            tarjetaSalud: [''],
            organismoSalud: [''],
            tipoSangre: ['', Validators.required],

            // Enfermedades (FormArray wrapper handled manually or via simple array)
            enfermedades: [[]],

            // Condiciones
            transfusion: ['', Validators.required],

            cardiaco: ['', Validators.required],
            cardiacoMed: [''],

            diabetes: ['', Validators.required],
            diabetesMed: [''],

            renal: ['', Validators.required],
            renalMed: [''],

            psicologico: ['', Validators.required],
            psicologicoMed: [''],

            // Alergias
            alergiaPiel: ['', Validators.required],
            alergiaAlimentos: ['', Validators.required],
            alergiaMedicamentos: ['', Validators.required],
            listaAlergias: [''],
            medicamentosAlergias: [''],

            // Eventos
            problemasRecientes: ['', Validators.required],
            medicamentosRecientes: [''],
            lesionGrave: ['', Validators.required],
            fractura: ['', Validators.required],
            tiempoInmovilizado: [''],
            cirugias: [''],
            hospitalizacion: [''],

            // Discapacidades
            discapacidades: [[]],
            observacionDiscapacidad: ['']
        });

        // Setup conditional validators listeners if needed (basic UI toggling is enough mostly, 
        // but clearing values if 'No' is selected is good practice)
    }

    validateToken() {
        this.api.validateToken(this.token).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success) {
                    this.isValidToken = true;
                    if (res.isEdit && res.data) {
                        this.form.patchValue(res.data);
                        // Patch arrays manually if needed depending on backend format
                    }
                } else {
                    this.error = res.message;
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Error validando enlace';
            }
        });
    }

    // Helpers for Checkboxes
    onCheckboxChange(e: any, arrayName: string) {
        const checkArray: string[] = this.form.get(arrayName)?.value || [];
        if (e.target.checked) {
            checkArray.push(e.target.value);
        } else {
            const index = checkArray.indexOf(e.target.value);
            if (index > -1) {
                checkArray.splice(index, 1);
            }
        }
        this.form.get(arrayName)?.setValue(checkArray);
    }

    isChecked(value: string, arrayName: string): boolean {
        const val = this.form.get(arrayName)?.value;
        return Array.isArray(val) && val.includes(value);
    }

    onSubmit() {
        if (this.form.valid) {
            this.isSubmitting = true;
            this.api.submitForm(this.token, this.form.value).subscribe({
                next: (res) => {
                    this.isSubmitting = false;
                    if (res.success) {
                        this.success = true;
                        this.form.disable();
                    } else {
                        alert(res.message);
                    }
                },
                error: (err) => {
                    this.isSubmitting = false;
                    alert(err.error?.message || 'Error enviando formulario');
                }
            });
        } else {
            this.markFormGroupTouched(this.form);
            this.scrollToFirstError();
            alert('Por favor complete todos los campos requeridos');
        }
    }

    scrollToFirstError() {
        // Timeout to let Angular update the DOM with .ng-invalid classes
        setTimeout(() => {
            const firstInvalidControl: HTMLElement | null = document.querySelector('input.ng-invalid, select.ng-invalid, textarea.ng-invalid');
            if (firstInvalidControl) {
                firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidControl.focus();
            }
        }, 100);
    }

    markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }
}
