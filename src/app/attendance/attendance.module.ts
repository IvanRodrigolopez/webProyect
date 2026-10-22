import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AttendanceFormComponent } from './attendance-form/attendance-form.component';


// Módulos de PrimeNG necesarios
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    AttendanceFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Recomendado para formularios con validación
    FileUploadModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    ButtonModule
  ],
  exports: [
    AttendanceFormComponent // Exportar si lo usarás fuera del módulo
  ]
})
export class AttendanceModule { }
