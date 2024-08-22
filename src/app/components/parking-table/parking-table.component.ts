import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ParkingService } from '../../services/parking.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';

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
        return totalHours > 0 ? totalHours * tariffHour : tariffHour;
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

    // Construir el Ticket

    formatDateTime(date: string): string {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    }

    printTicketEntry() {
        if (this.selectedParking) {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a7',
            });

            doc.setFont('courier');

            // Header
            doc.setFontSize(8);
            doc.text('La Parka - Estacionamiento', 15, 7);
            doc.text('------------------------------------------', 1.5, 12);

            // Título
            doc.setFontSize(12);
            doc.text('Comprobante de Ingreso', 9, 34);

            // Info Cliente
            doc.setFontSize(10);
            doc.text(`ID: ${this.selectedParking.id}`, 5, 44);
            doc.text(`Cliente: ${this.selectedParking.cliente.name}`, 5, 49);

            // Info Vehículo
            doc.text(`Placa: ${this.selectedParking.vehicle.plate}`, 5, 54);

            // Info Fecha
            doc.text(
                `Entrada: ${this.formatDateTime(this.selectedParking.checkin)}`,
                5,
                59
            );

            doc.setFontSize(12);
            doc.text('Por favor, conserve', 13, 69);
            doc.text('este comprobante', 16.5, 74);

            // Footer
            doc.setFontSize(8);
            doc.text('------------------------------------------', 1.5, 95);
            doc.text('La Parka - Estacionamiento', 15, 100);

            // Abrir cuadro de impresión
            doc.autoPrint();

            const pdfBlob = doc.output('bloburl');
            const newWindow = window.open(pdfBlob);

            if (newWindow) {
                newWindow.focus();
            }
        }
    }

    generateTicketExit(): jsPDF {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a7',
        });

        doc.setFont('courier');

        // Header
        doc.setFontSize(8);
        doc.text('La Parka - Estacionamiento', 15, 7);
        doc.text('------------------------------------------', 1.5, 12);

        // Título
        doc.setFontSize(12);
        doc.text('Comprobante de Pago', 13, 24);

        // Info Cliente
        doc.setFontSize(10);
        doc.text(`ID: ${this.selectedParking.id}`, 5, 34);
        doc.text(`Cliente: ${this.selectedParking.cliente.name}`, 5, 39);

        // Info Vehículo
        doc.text(`Placa: ${this.selectedParking.vehicle.plate}`, 5, 44);

        // Info Fecha
        doc.text(
            `Entrada: ${this.formatDateTime(this.selectedParking.checkin)}`,
            5,
            49
        );

        doc.text(
            `Salida: ${this.formatDateTime(this.selectedParking.checkout)}`,
            5,
            54
        );
        doc.text(
            `Tiempo: ${this.getDateTime(this.selectedParking.checkin)}`,
            5,
            59
        );

        // Total
        doc.setFontSize(12);
        doc.text('Total:', 5, 69);
        doc.text(`${this.formatCurrency(this.selectedParking.total)}`, 5, 74);

        doc.setFontSize(12);
        doc.text('Gracias por su preferencia', 4, 84);

        // Footer
        doc.setFontSize(8);
        doc.text('------------------------------------------', 1.5, 95);
        doc.text('La Parka - Estacionamiento', 15, 100);

        return doc;
    }

    printTicketExit() {
        if (this.selectedParking) {
            const doc = this.generateTicketExit();

            // Abrir cuadro de impresión
            doc.autoPrint();

            const pdfBlob = doc.output('bloburl');
            const newWindow = window.open(pdfBlob);

            if (newWindow) {
                newWindow.focus();
            }
        }
    }

    downloadTicketExit() {
        if (this.selectedParking) {
            const doc = this.generateTicketExit();

            doc.save(
                `Ticket_${new Date(
                    this.selectedParking.checkin
                ).toLocaleDateString()}_${
                    this.selectedParking.vehicle.plate
                }.pdf`
            );
        }
    }
}
