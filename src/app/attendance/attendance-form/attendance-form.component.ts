import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from 'src/app/services/attendance.service';
import { SucursalService } from 'src/app/services/sucursal.service';

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.scss']
})
export class AttendanceFormComponent implements OnInit {
  attendanceForm!: FormGroup;

  // Lista de sucursales (ejemplo)
  // branches = [
  //   { label: 'Sucursal Centro', value: 'CENTRO' },
  //   { label: 'Sucursal Norte', value: 'NORTE' },
  //   { label: 'Sucursal Sur', value: 'SUR' }
  // ];
  branches: any[] = [];

  // Para mostrar la vista previa de la imagen
  previewImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private sucursalService: SucursalService, private attendanceService: AttendanceService) { }


  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      guardName: ['', [Validators.required, Validators.minLength(3)]],
      branch: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      isRestDay: [false],
      image: [null] // Aquí guardaremos el archivo si es necesario
    });

    this.cargarSucursales();
  }

  cargarSucursales() {
    this.sucursalService.getSucursalesActivas().subscribe({
      next: (data: any) => {
        // Mapeamos el JSON de .NET a lo que espera el p-dropdown de PrimeNG
        this.branches = data.map((sucursal: { nombre: any; }) => ({
          label: sucursal.nombre,
          value: sucursal.nombre // Puedes usar sucursal.id si quieres guardar el ID
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar sucursales:', err);
      }
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
      // Obtenemos los valores. getRawValue() incluye los campos deshabilitados (como la hora si es descanso)
      const formData = this.attendanceForm.getRawValue();

      // Formatear la fecha y hora para que .NET las entienda perfectamente
      const payload = {
        guardName: formData.guardName,
        branch: formData.branch,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        time: formData.time ? new Date(formData.time).toTimeString().split(' ')[0] : '00:00:00',
        isRestDay: formData.isRestDay,
        imageUrl: null // Si luego implementas subida de imagen, aquí iría la URL
      };

      this.attendanceService.registrarAsistencia(payload).subscribe({
        next: (res) => {
          alert('¡Asistencia registrada con éxito!');
          this.attendanceForm.reset({ isRestDay: false }); // Limpiar formulario
          this.previewImage = null;
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          // Muestra el mensaje de error de la API si existe
          const errorMsg = err.error?.message || 'Ocurrió un error al guardar';
          alert(errorMsg);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.attendanceForm.controls).forEach(key => {
        this.attendanceForm.get(key)?.markAsTouched();
      });
    }
  }

}
