import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceFormComponent } from './attendance/attendance-form/attendance-form.component';
import { CalendarioAsistenciaComponent } from './calendario/calendario-asistencia/calendario-asistencia.component';


const routes: Routes = [
  { path: 'asistencia', component: AttendanceFormComponent },
   { path: 'calendario', component: CalendarioAsistenciaComponent },
  // Si quieres que sea la página principal, usa path: '' en lugar de 'asistencia'
  { path: '', redirectTo: '/asistencia', pathMatch: 'full' } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
