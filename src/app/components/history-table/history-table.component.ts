import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-history-table',
    templateUrl: './history-table.component.html',
    styleUrl: './history-table.component.scss',
})
export class HistoryTableComponent {
    parking: any[] = [];
    selectedParking: any;
    p: number = 1;
    // itemsPerPage: number = 10;
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

    // Construir el Ticket

    // Calcular los minutos transcurridos desde la fecha checkin hasta la fecha checkout
    getDateTime(checkin: string, checkout: string): string {
        const checkinDate = new Date(checkin);
        const currentDate = new Date(checkout);

        const totalMinutes = Math.floor(
            (currentDate.getTime() - checkinDate.getTime()) / 60000
        );

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes} min`;
    }

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
            `Tiempo: ${this.getDateTime(
                this.selectedParking.checkin,
                this.selectedParking.checkout
            )}`,
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

    downloadTicketExit() {
        if (this.selectedParking) {
            const doc = this.generateTicketExit();

            doc.save(
                `Ticket_${new Date(
                    this.selectedParking.checkin
                ).toLocaleDateString()}_${this.selectedParking.id}.pdf`
            );
        }
    }
}
