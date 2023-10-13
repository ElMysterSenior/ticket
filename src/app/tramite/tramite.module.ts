
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Si estás usando Reactive Forms
import { TramiteComponent } from './tramite.component';

@NgModule({
  declarations: [TramiteComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule // Si estás usando Reactive Forms
  ],
  exports: [TramiteComponent]
})
export class TramiteModule { }
