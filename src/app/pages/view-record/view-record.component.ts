import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-view-record',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './view-record.component.html',
    styles: []
})
export class ViewRecordComponent implements OnInit {
    @Input() id: string = '';
    form!: FormGroup;
    isLoading = true;
    error = '';
    record: any = null;

    // Options (Same as Form)
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
        if (this.id) {
            this.loadRecord();
        } else {
            this.error = 'ID no proporcionado';
            this.isLoading = false;
        }
    }

    initForm() {
        // Clone of MedicalFormComponent init, but no validators needed since it's read-only
        this.form = this.fb.group({
            nombre: [''],
            fechaNacimiento: [''],
            sexo: [''],
            funcion: [''],
            estadoCivil: [''],
            planSalud: [''],
            nombrePlan: [''],
            tarjetaSalud: [''],
            organismoSalud: [''],
            tipoSangre: [''],
            enfermedades: [[]],
            transfusion: [''],
            cardiaco: [''],
            cardiacoMed: [''],
            diabetes: [''],
            diabetesMed: [''],
            renal: [''],
            renalMed: [''],
            psicologico: [''],
            psicologicoMed: [''],
            alergiaPiel: [''],
            alergiaAlimentos: [''],
            alergiaMedicamentos: [''],
            listaAlergias: [''],
            medicamentosAlergias: [''],
            problemasRecientes: [''],
            medicamentosRecientes: [''],
            lesionGrave: [''],
            fractura: [''],
            tiempoInmovilizado: [''],
            cirugias: [''],
            hospitalizacion: [''],
            discapacidades: [[]],
            observacionDiscapacidad: ['']
        });

        this.form.disable(); // Make it read-only
    }

    loadRecord() {
        this.api.getRecord(this.id).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success) {
                    this.record = res.record;
                    // Format Date for Input Date
                    if (this.record.fechaNacimiento) {
                        this.record.fechaNacimiento = new Date(this.record.fechaNacimiento).toISOString().split('T')[0];
                    }
                    this.form.patchValue(this.record);
                } else {
                    this.error = res.message;
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Error cargando ficha';
            }
        });
    }

    isChecked(value: string, arrayName: string): boolean {
        const val = this.form.get(arrayName)?.value;
        return Array.isArray(val) && val.includes(value);
    }
}
