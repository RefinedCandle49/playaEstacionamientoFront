import {Component, inject, OnInit} from '@angular/core';
import {ParkingService} from "../../services/parking.service";

@Component({
  selector: 'app-parking-table',
  templateUrl: './parking-table.component.html',
  styleUrl: './parking-table.component.css'
})
export class ParkingTableComponent  implements OnInit{
  private parkingService = inject(ParkingService);

  parking: any[] = [];

  ngOnInit(): void {
    this.parkingService.getFree()
      .subscribe((parking: any) => {
        this.parking = parking
      })
  }
}
