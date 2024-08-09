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

    this.parkingService.getCount().subscribe(
      (count) => {
        // Asegúrate de convertir el valor a un número, dependiendo de lo que Devuelva el servicio.
        // @ts-ignore
        if (count > 9) {
          console.log('El número de vehículos ya ha alcanzado el límite. No se puede registrar más vehículos.');
          // Aquí podrías mostrar un mensaje de usuario, por ejemplo:
          alert('No se pueden registrar más vehículos. Límite alcanzado.');
        } else {
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
      },
      (error) => {
        console.error('Error al obtener la cuenta de vehículos:', error);
      }
    );
  }
}
