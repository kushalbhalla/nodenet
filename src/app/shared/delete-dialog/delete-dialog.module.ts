import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDialogComponent } from './delete-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DeleteDialogModule { }
