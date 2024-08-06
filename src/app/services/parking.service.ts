import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private http = inject(HttpClient);

  getFree() {
    return this.http.get('http://localhost:8080/parking/free');
  }

  getOccupied() {
    return this.http.get('http://localhost:8080/parking/occupied');
  }

  create(parking: any) {
    return this.http.post('http://localhost:8080/parking/save', parking);
  }
}
