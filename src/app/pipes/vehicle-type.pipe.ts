import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleType',
})
export class VehicleTypePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Carro';
      case 2:
        return 'Moto';
      default:
        return 'Desconocido';
    }
  }
}
