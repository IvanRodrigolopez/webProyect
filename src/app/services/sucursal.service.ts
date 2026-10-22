import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz para que TypeScript nos ayude con el autocompletado
export interface Sucursal {
  id: number;
  nombre: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  
  // ⚠️ IMPORTANTE: Cambia el puerto por el que te arroja tu API al ejecutarla (dotnet run)
  private apiUrl = 'http://localhost:5108/api/Sucursal'; 

  constructor(private http: HttpClient) { }

  getSucursalesActivas(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl);
  }
}