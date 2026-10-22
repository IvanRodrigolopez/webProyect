import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../services/sucursal.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-calendario-asistencia',
  templateUrl: './calendario-asistencia.component.html',
  styleUrls: ['./calendario-asistencia.component.scss']
})
export class CalendarioAsistenciaComponent implements OnInit {
  sucursales: any[] = [];
  sucursalSeleccionada: string | null = null;
  
  // Mapa para búsqueda rápida. Ej: { "2025-10-22": "asistencia" }
  estadosPorDia: { [key: string]: string } = {};
  
  // Fecha actual para el calendario
  fechaActual: Date = new Date();

  constructor(
    private sucursalService: SucursalService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.cargarSucursales();
  }

  cargarSucursales() {
    this.sucursalService.getSucursalesActivas().subscribe({
      next: (data) => {
        this.sucursales = data.map(s => ({ label: s.nombre, value: s.nombre }));
      },
      error: (err) => console.error('Error al cargar sucursales', err)
    });
  }

  onSucursalChange(event: any) {
    this.sucursalSeleccionada = event.value;
    this.cargarAsistenciasDelMes();
  }

  // Se ejecuta al cambiar de sucursal o de mes en el calendario
  cargarAsistenciasDelMes() {
    if (!this.sucursalSeleccionada) return;
    
    this.attendanceService.getAsistenciasPorSucursal(this.sucursalSeleccionada)
      .subscribe({
        next: (registros: any[]) => {
          this.estadosPorDia = {};
          
          registros.forEach(reg => {
            // Convertimos la fecha de .NET a formato "YYYY-MM-DD"
            const fechaStr = new Date(reg.date).toISOString().split('T')[0];
            
            // Si el registro es descanso, lo marcamos; si no, es asistencia
            this.estadosPorDia[fechaStr] = reg.isRestDay ? 'descanso' : 'asistencia';
          });
        },
        error: (err) => console.error('Error al cargar asistencias', err)
      });
  }

  // Método que evalúa qué color ponerle a cada celda del calendario
  getEstadoDia(date: any): string {
    // El objeto 'date' de PrimeNG trae year, month (0-11) y day
    const mes = (date.month + 1).toString().padStart(2, '0');
    const dia = date.day.toString().padStart(2, '0');
    const fechaStr = `${date.year}-${mes}-${dia}`;
    
    // Si ya hay un registro, lo devuelve. Si no, devuelve 'sin-registro'
    return this.estadosPorDia[fechaStr] || 'sin-registro';
  }
}