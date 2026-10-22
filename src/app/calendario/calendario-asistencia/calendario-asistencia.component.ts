import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../services/sucursal.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-calendario-asistencia',
  templateUrl: './calendario-asistencia.component.html',
  styleUrls: ['./calendario-asistencia.component.scss'],
})
export class CalendarioAsistenciaComponent implements OnInit {
  sucursales: any[] = [];
  sucursalSeleccionada: string | null = null;

  // Mapa para búsqueda rápida. Ej: { "2025-10-22": "asistencia" }
  estadosPorDia: { [key: string]: string } = {};

  // Fecha actual para el calendario
  fechaActual: Date = new Date();

  // 👇 Nuevas variables para el modal
  mostrarDialogo: boolean = false;
  registroSeleccionado: any = null;

  mostrarImagenExpandida: boolean = false;

  // 👇 Guardamos todos los registros del mes actual para no volver a consultar la API al hacer clic
  registrosDelMes: any[] = [];

  constructor(
    private sucursalService: SucursalService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit() {
    this.cargarSucursales();
  }

  cargarSucursales() {
    this.sucursalService.getSucursalesActivas().subscribe({
      next: (data) => {
        this.sucursales = data.map((s) => ({
          label: s.nombre,
          value: s.nombre,
        }));
      },
      error: (err) => console.error('Error al cargar sucursales', err),
    });
  }

  onSucursalChange(event: any) {
    this.sucursalSeleccionada = event.value;
    this.cargarAsistenciasDelMes();
  }

  // Se ejecuta al cambiar de sucursal o de mes en el calendario
  cargarAsistenciasDelMes() {
    if (!this.sucursalSeleccionada) return;

    this.attendanceService
      .getAsistenciasPorSucursal(this.sucursalSeleccionada)
      .subscribe({
        next: (registros: any[]) => {
          this.registrosDelMes = registros;
          this.estadosPorDia = {};
          registros.forEach((reg) => {
            const fechaStr = new Date(reg.date).toISOString().split('T')[0];
            if (reg.isAbsence) {
              this.estadosPorDia[fechaStr] = 'falta';
            } else if (reg.isRestDay) {
              this.estadosPorDia[fechaStr] = 'descanso';
            } else {
              this.estadosPorDia[fechaStr] = 'asistencia';
            }
          });
          // registros.forEach((reg) => {
          //   // Convertimos la fecha de .NET a formato "YYYY-MM-DD"
          //   const fechaStr = new Date(reg.date).toISOString().split('T')[0];

          //   // Si el registro es descanso, lo marcamos; si no, es asistencia
          //   this.estadosPorDia[fechaStr] = reg.isRestDay
          //     ? 'descanso'
          //     : 'asistencia';
          // });
        },
        error: (err) => console.error('Error al cargar asistencias', err),
      });
  }

  // 👇 EVENTO: Al hacer clic en un día del calendario
  onDiaSeleccionado(event: any) {
    // event trae la fecha seleccionada
    if (!this.sucursalSeleccionada) return;

    // Formateamos la fecha del calendario a "YYYY-MM-DD" para comparar
    const fechaClic = new Date(event);
    const fechaStr = `${fechaClic.getFullYear()}-${(fechaClic.getMonth() + 1).toString().padStart(2, '0')}-${fechaClic.getDate().toString().padStart(2, '0')}`;

    // Buscamos en la lista de registros que ya descargamos
    const registro = this.registrosDelMes.find((r) => {
      const rDate = new Date(r.date).toISOString().split('T')[0];
      return rDate === fechaStr;
    });

    if (registro) {
      this.registroSeleccionado = registro;
      this.mostrarDialogo = true; // Abrimos el modal
    } else {
      // Opcional: Si haces clic en un día sin registro, puedes mostrar una alerta o no hacer nada
      // alert('No hay registros para este día.');
    }
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

  descargarReporte() {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1; // Mes actual (1-12)
    const anio = hoy.getFullYear(); // Año actual

    this.attendanceService.descargarReporteZip(mes, anio).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Fotos_Asistencias_${mes}_${anio}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el reporte', err);
        alert('Hubo un error al generar el reporte.');
      },
    });

    // this.attendanceService.descargarReporteExcel(mes, anio).subscribe({
    //   next: (blob) => {
    //     // Crear un enlace falso para descargar el archivo
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `Reporte_Asistencia_${mes}_${anio}.xlsx`;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error: (err) => {
    //     console.error('Error al descargar el reporte', err);
    //     alert('Hubo un error al generar el reporte.');
    //   },
    // });
  }
}
