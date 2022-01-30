import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostOpsComponent } from './post-ops.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    PostOpsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class PostOpsModule { }
