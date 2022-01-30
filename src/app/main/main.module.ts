import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FeedComponent } from './feed/feed.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { PostComponent } from './feed/post/post.component';

@NgModule({
  declarations: [
    MainComponent,
    FeedComponent,
    RightbarComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
