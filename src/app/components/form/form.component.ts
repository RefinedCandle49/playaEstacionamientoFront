import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
    // Propiedades
    parkingForm: FormGroup;
    dnis: any[] = [];
    parkingRecords: any[] = [];
    private parkingService = inject(ParkingService);
    private toastr = inject(ToastrService);
    private fb = inject(FormBuilder);

    // Constructor
    constructor() {
        this.parkingForm = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            dni: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                ],
            ],
            plate: [
                '',
                [
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(7),
                ],
            ],
            type: ['1', [Validators.required]],
        });
    }

    // Ciclo de Vida
    ngOnInit() {
        this.loadDni();
        this.getParkingRecords();
    }

    // Metodos de negocio
    getParkingRecords() {
        this.parkingService.parkingData$.subscribe((records: any[]) => {
            this.parkingRecords = records;
        });
    }

    loadDni() {
        this.parkingService.getAllDnis().subscribe((dnis: any) => {
            this.dnis = dnis;
        });
    }

    onSubmit() {
        // Validar envío del formulario
        if (this.parkingForm.invalid) {
            this.toastr.error(
                'Por favor, complétalo correctamente.',
                'Formulario Incorrecto',
                {
                    timeOut: 3000,
                    progressBar: true,
                    progressAnimation: 'decreasing',
                    positionClass: 'toast-bottom-right',
                }
            );
            this.parkingForm.markAllAsTouched();
            return;
        }

        // getRawValue: Leer campos disableb
        const formValues = this.parkingForm.getRawValue();
        const plateExists = this.parkingRecords.some(
            (record) => record.vehicle.plate === formValues.plate
        );

        if (plateExists) {
            this.toastr.error(
                'No se puede volver a registrar la placa.',
                'Placa Registrada',
                {
                    timeOut: 3000,
                    progressBar: true,
                    progressAnimation: 'decreasing',
                    positionClass: 'toast-bottom-right',
                }
            );
            return;
        }

        const parkingData = {
            checkin: new Date().toLocaleString('sv-SE'),
            checkout: null,
            total: null,
            cliente: {
                name: formValues.name,
                dni: formValues.dni,
            },
            vehicle: {
                plate: formValues.plate,
                type: formValues.type,
            },
        };

        this.parkingService.getCount().subscribe(
            (count) => {
                // @ts-ignore
                if (count > 9) {
                    this.toastr.warning(
                        'No se pueden registrar más vehículos.',
                        'Límite alcanzado',
                        {
                            timeOut: 3000,
                            progressBar: true,
                            progressAnimation: 'decreasing',
                            positionClass: 'toast-bottom-right',
                        }
                    );
                } else {
                    this.parkingService.create(parkingData).subscribe(
                        (response) => {
                            this.parkingForm.reset({
                                name: '',
                                dni: '',
                                plate: '',
                                type: '1',
                            });
                            this.parkingForm.get('name')?.enable();

                            console.log('VehÍculo registrado: ', response);
                        },
                        (error) => {
                            console.error(
                                'Error al registrar el vehículo:',
                                error
                            );
                        }
                    );
                }
            },
            (error) => {
                console.error(
                    'Error al obtener la cuenta de vehículos:',
                    error
                );
            }
        );
    }

    // Validaciones del formulario
    hasErrors(controlName: string, errorType: string) {
        return (
            this.parkingForm.get(controlName)?.hasError(errorType) &&
            this.parkingForm.get(controlName)?.touched
        );
    }

    getErrorClass(controlName: string): string {
        return this.hasErrors(controlName, 'required') ||
            this.hasErrors(controlName, 'minlength') ||
            this.hasErrors(controlName, 'maxlength')
            ? 'is-invalid'
            : '';
    }

    getErrorMessage(controlName: string): string | null {
        const control = this.parkingForm.get(controlName);

        if (control?.errors) {
            switch (true) {
                case control.hasError('required'):
                    return 'Este campo es obligatorio';
                case control.hasError('minlength'):
                    return `Ingrese mínimo ${
                        control.getError('minlength').requiredLength
                    } caracteres`;
                case control.hasError('maxlength'):
                    return `Ingrese máximo ${
                        control.getError('maxlength').requiredLength
                    } caracteres`;
                default:
                    return null;
            }
        }
        return null;
    }

    // Eventos del componente
    onDniChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const dni = inputElement.value;

        if (dni.length === 8) {
            this.parkingService
                .getClientebyDni(dni)
                .subscribe((response: any) => {
                    if (response && response.length > 0) {
                        this.parkingForm.get('name')?.disable();
                        this.parkingForm.get('name')?.setValue(response[0]);
                    } else {
                        this.parkingForm.get('name')?.enable();
                        this.toastr.info(
                            'No se encontró un cliente con ese DNI',
                            'Información',
                            {
                                timeOut: 3000,
                                progressBar: true,
                                progressAnimation: 'decreasing',
                                positionClass: 'toast-bottom-right',
                            }
                        );
                    }
                });
        }
    }
}
