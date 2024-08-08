import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  parkingForm: FormGroup;
  private parkingService = inject(ParkingService);
  private fb = inject(FormBuilder);

  // Constructor de los datos del formulario
  constructor() {
    this.parkingForm = this.fb.group({
      name: '',
      dni: '',
      plate: '',
      type: '1',
    });
  }

  // Enviar datos del formulario mediante un JSON
  onSubmit() {
    const formValues = this.parkingForm.value;

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

    // Usar metodo POST del API
    this.parkingService.create(parkingData).subscribe(
      (response) => {
        this.parkingForm.reset(); // Limpiar formulario

        console.log('Vehiculo registrado: ', response);
      },
      (error) => {
        console.error('Error al registrar el vehículo:', error);
      }
    );
  }
}
