import { Component, inject, OnInit } from '@angular/core';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-parking-table',
  templateUrl: './parking-table.component.html',
  styleUrl: './parking-table.component.css',
})
export class ParkingTableComponent implements OnInit {
  private parkingService = inject(ParkingService);

  parking: any[] = [];

  ngOnInit(): void {
    this.parkingService.getOccupied().subscribe((parking: any) => {
      this.parking = parking;
    });
  }

  // Calcular los minutos transcurridos desde la fecha chekin hasta la fecha actual
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
}
