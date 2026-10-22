import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { provideHttpClient } from '@angular/common/http'; // 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AttendanceModule } from './attendance/attendance.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AttendanceModule
  ],
  providers: [
     provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
