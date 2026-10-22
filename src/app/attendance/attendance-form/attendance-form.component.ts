import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from 'src/app/services/attendance.service';
import { SucursalService } from 'src/app/services/sucursal.service';

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.scss'],
})
export class AttendanceFormComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: any;
  attendanceForm!: FormGroup;
  branches: any[] = [];
  previewImage: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null;

  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      guardName: ['', [Validators.required, Validators.minLength(3)]],
      branch: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      isRestDay: [false],
      isAbsence: [false],
    });

    // Lógica para que sean excluyentes y habilitar/deshabilitar la hora
    this.attendanceForm.get('isRestDay')?.valueChanges.subscribe((isRest) => {
      const timeControl = this.attendanceForm.get('time');
      const absenceControl = this.attendanceForm.get('isAbsence');

      if (isRest) {
        absenceControl?.setValue(false);
        timeControl?.clearValidators();
        timeControl?.disable();
      } else if (!this.attendanceForm.get('isAbsence')?.value) {
        timeControl?.setValidators(Validators.required);
        timeControl?.enable();
      }
      timeControl?.updateValueAndValidity();
    });

    this.attendanceForm
      .get('isAbsence')
      ?.valueChanges.subscribe((isAbsence) => {
        const timeControl = this.attendanceForm.get('time');
        const restControl = this.attendanceForm.get('isRestDay');

        if (isAbsence) {
          restControl?.setValue(false);
          timeControl?.clearValidators();
          timeControl?.disable();
        } else if (!this.attendanceForm.get('isRestDay')?.value) {
          timeControl?.setValidators(Validators.required);
          timeControl?.enable();
        }
        timeControl?.updateValueAndValidity();
      });

    this.cargarSucursales();
  }

  cargarSucursales() {
    this.sucursalService.getSucursalesActivas().subscribe({
      next: (data: any) => {
        this.branches = data.map((sucursal: { nombre: any }) => ({
          label: sucursal.nombre,
          value: sucursal.nombre,
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar sucursales:', err);
      },
    });
  }

  // Manejar la selección de imagen (FileUpload de PrimeNG)
  onImageSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.archivoSeleccionado = file;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => (this.previewImage = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Enviar formulario
  onSubmit() {
    if (this.attendanceForm.valid) {
      const formData = this.attendanceForm.getRawValue();

      // 1. Si hay una imagen seleccionada, la subimos primero
      if (this.archivoSeleccionado) {
        this.attendanceService.subirImagen(this.archivoSeleccionado).subscribe({
          next: (res) => {
            // Cuando la imagen se sube, obtenemos la URL y guardamos la asistencia
            this.guardarAsistencia(formData, res.imageUrl);
          },
          error: (err) => {
            console.error('Error al subir la imagen', err);
            alert('Error al subir la imagen. Intente de nuevo.');
          },
        });
      } else {
        // 2. Si no hay imagen, guardamos directo con null
        this.guardarAsistencia(formData, null);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.attendanceForm.controls).forEach((key) => {
        this.attendanceForm.get(key)?.markAsTouched();
      });
    }
  }

  // Método separado para guardar la asistencia (recibe la URL de la imagen ya subida)
  guardarAsistencia(formData: any, imageUrl: string | null) {
    const payload = {
      guardName: formData.guardName,
      branch: formData.branch,
      date: formData.date ? new Date(formData.date).toISOString() : null,
      time: formData.time
        ? new Date(formData.time).toTimeString().split(' ')[0]
        : '00:00:00',
      isRestDay: formData.isRestDay,
      isAbsence: formData.isAbsence,
      imageUrl: imageUrl, // 👈 Aquí ya va la URL real
    };

    this.attendanceService.registrarAsistencia(payload).subscribe({
      next: (res) => {
        alert('¡Asistencia registrada con éxito!');
        // Limpiar formulario y variables
        this.attendanceForm.reset({ isRestDay: false, isAbsence: false });
        this.previewImage = null;
        this.archivoSeleccionado = null;
        if (this.fileUpload) {
          this.fileUpload.clear();
        }
        // Habilitar el campo de hora de nuevo por si se había deshabilitado
        this.attendanceForm.get('time')?.enable();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        const errorMsg = err.error?.message || 'Ocurrió un error al guardar';
        alert(errorMsg);
      },
    });

    
  }

  eliminarFoto() {
  this.previewImage = null;
  this.archivoSeleccionado = null;
  
  // Limpiar el componente visual de PrimeNG
  if (this.fileUpload) {
    this.fileUpload.clear();
  }}
}
