import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ParkingService } from '../../services/parking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parking-table',
  templateUrl: './parking-table.component.html',
  styleUrl: './parking-table.component.css',
})
export class ParkingTableComponent implements OnInit, OnDestroy {
  parking: any[] = [];
  selectedParking: any;
  private parkingService = inject(ParkingService);
  private parkingSub?: Subscription;

  ngOnInit(): void {
    this.getParkingData();

    this.parkingSub = this.parkingService
      .getParkingUpdatedListener()
      .subscribe(() => {
        this.getParkingData(); // Actualizar tabla cuando exista nuevo registro
      });
  }

  // Obtener datos para tabla con total null
  getParkingData() {
    this.parkingService.getOccupied().subscribe((parking: any) => {
      this.parking = parking;
      this.parkingService.setParkingData(parking);
    });
  }

  // Obtener datos por id
  getDataForId(id: number) {
    this.parkingService.getById(id).subscribe((parking: any) => {
      this.selectedParking = parking;
    });
  }

  // Actualizar registro
  finishParking() {
    if (this.selectedParking) {
      const checkout = new Date().toLocaleString('sv-SE');
      const total = this.calculateTotal(
        this.selectedParking?.checkin,
        checkout
      );

      const parkingData = {
        total: total,
        checkout: checkout,
      };

      this.parkingService
        .update(this.selectedParking.id, parkingData)
        .subscribe(
          (response) => {
            this.getParkingData();
            this.getDataForId(this.selectedParking.id);
            console.log('Actualizacion exitosa: ', response);
          },
          (error) => {
            console.error('Error al actualizar:', error);
          }
        );
    }
  }

  // Calcular monto total por hora
  calculateTotal(checkin: string, checkout: string): number {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    const totalMinutes = Math.floor(
      (checkoutDate.getTime() - checkinDate.getTime()) / 60000
    );
    const totalHours = Math.ceil(totalMinutes / 60); // CEIL: Redondear hacia arriba

    const tariffHour = 1.5;
    return totalHours * tariffHour;
  }

  // Calcular los minutos transcurridos desde la fecha checkin hasta la fecha actual
  getDateTime(checkin: string): string {
    const checkinDate = new Date(checkin);
    const currentDate = new Date();

    const totalMinutes = Math.floor(
      (currentDate.getTime() - checkinDate.getTime()) / 60000
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes} min`;
  }

  // Actualizar los tiempos
  updateAllTimes(): void {
    this.parking = this.parking.map((record) => ({
      ...record,
      hours: this.getDateTime(record.checkin),
      minutes: this.getDateTime(record.checkin),
    }));
  }

  // Leer placas de la tabla
  readPlates(plate: string): boolean {
    return this.parking.some((record) => record.vehicle.plate === plate);
  }

  ngOnDestroy() {
    this.parkingSub?.unsubscribe(); // Limpiar suscripcion
  }
}
