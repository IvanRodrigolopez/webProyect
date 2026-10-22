import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // Para el ngModel del selector

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog'; // 👈 Agregar
import { TagModule } from 'primeng/tag';


import { CalendarioAsistenciaComponent } from './calendario-asistencia/calendario-asistencia.component';

@NgModule({
  declarations: [
    CalendarioAsistenciaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    TagModule
  ],
  exports: [
    CalendarioAsistenciaComponent
  ]
})
export class CalendarioModule { }