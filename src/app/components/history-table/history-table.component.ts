import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.css',
})
export class HistoryTableComponent {
  parking: any[] = [];
  selectedParking: any;
  private parkingService = inject(ParkingService);

  ngOnInit(): void {
    this.getParkingHistory();
  }

  // Obtener datos para tabla con total
  getParkingHistory() {
    this.parkingService.getFree().subscribe((parking: any) => {
      this.parking = parking;
    });
  }

  // Obtener datos por id
  getDataForId(id: number) {
    this.parkingService.getById(id).subscribe((parking: any) => {
      this.selectedParking = parking;
    });
  }
}
