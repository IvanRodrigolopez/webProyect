import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  // Ajusta el puerto al de tu API
  private apiUrl = 'http://localhost:5108/api/Asistencia';

  constructor(private http: HttpClient) {}

  // Recibe un objeto con los datos del formulario
  registrarAsistencia(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAsistenciasPorSucursal(sucursal: string): Observable<any[]> {
    // Ajusta la URL a tu puerto real
    return this.http.get<any[]>(
      `http://localhost:5108/api/Asistencia/por-sucursal?sucursal=${sucursal}`,
    );
  }
  descargarReporteExcel(mes: number, anio: number): Observable<Blob> {
    const url = `http://localhost:5108/api/Asistencia/reporte-excel`; // Ajusta el puerto
    const params = new HttpParams().set('mes', mes).set('anio', anio);

    return this.http.get(url, { params: params, responseType: 'blob' });
  }

  subirImagen(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Ajusta el puerto de tu API
    return this.http.post(
      'http://localhost:5108/api/Asistencia/upload',
      formData,
    );
  }

  descargarReporteZip(mes: number, anio: number): Observable<Blob> {
  const url = `http://localhost:5108/api/Asistencia/reporte-zip`; 
  const params = new HttpParams().set('mes', mes).set('anio', anio);
  return this.http.get(url, { params: params, responseType: 'blob' });
}
}
