import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAsistenciaComponent } from './calendario-asistencia.component';

describe('CalendarioAsistenciaComponent', () => {
  let component: CalendarioAsistenciaComponent;
  let fixture: ComponentFixture<CalendarioAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioAsistenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
