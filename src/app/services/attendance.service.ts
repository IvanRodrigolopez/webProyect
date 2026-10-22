import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  // Ajusta el puerto al de tu API
  private apiUrl = 'http://localhost:5108/api/Asistencia'; 

  constructor(private http: HttpClient) { }

  // Recibe un objeto con los datos del formulario
  registrarAsistencia(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAsistenciasPorSucursal(sucursal: string): Observable<any[]> {
  // Ajusta la URL a tu puerto real
  return this.http.get<any[]>(`http://localhost:5108/api/Asistencia/por-sucursal?sucursal=${sucursal}`);
}
}