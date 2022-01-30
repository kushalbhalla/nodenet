import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { ShowPostComponent } from './show-post/show-post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PostComponent,
    ShowPostComponent,
    CreatePostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PostModule { }
