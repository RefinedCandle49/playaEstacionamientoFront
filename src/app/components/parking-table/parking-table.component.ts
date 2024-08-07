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
    });
  }

  // Calcular los minutos transcurridos desde la fecha checkin hasta la fecha actual
  getDateTime(checkin: string): string {
    const checkinDate = new Date(checkin);
    const currentDate = new Date();

    const minutes = Math.floor(
      (currentDate.getTime() - checkinDate.getTime()) / 60000
    );

    return `${minutes} min`;
  }

  // Actualizar los tiempos
  updateAllTimes(): void {
    this.parking = this.parking.map((record) => ({
      ...record,
      minutes: this.getDateTime(record.checkin),
    }));
  }

  ngOnDestroy() {
    this.parkingSub?.unsubscribe(); // Limpiar suscripcion
  }
}
