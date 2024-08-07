import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.css',
})
export class HistoryTableComponent {
  private parkingService = inject(ParkingService);

  parking: any[] = [];

  ngOnInit(): void {
    this.parkingService.getFree().subscribe((parking: any) => {
      this.parking = parking;
    });
  }
}
