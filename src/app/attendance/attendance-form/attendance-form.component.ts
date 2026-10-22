import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.scss']
})
export class AttendanceFormComponent implements OnInit  {
  attendanceForm!: FormGroup;
  
  // Lista de sucursales (ejemplo)
  branches = [
    { label: 'Sucursal Centro', value: 'CENTRO' },
    { label: 'Sucursal Norte', value: 'NORTE' },
    { label: 'Sucursal Sur', value: 'SUR' }
  ];

  // Para mostrar la vista previa de la imagen
  previewImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {}


    ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      guardName: ['', [Validators.required, Validators.minLength(3)]],
      branch: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      image: [null] // Aquí guardaremos el archivo si es necesario
    });
  }

  // Manejar la selección de imagen (FileUpload de PrimeNG)
  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.attendanceForm.patchValue({ image: file });
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

    // Enviar formulario
  onSubmit() {
    if (this.attendanceForm.valid) {
      console.log('Datos del registro:', this.attendanceForm.value);
      // Aquí llamarías a tu servicio para guardar en backend
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.attendanceForm.controls).forEach(key => {
        this.attendanceForm.get(key)?.markAsTouched();
      });
    }
  }

}
