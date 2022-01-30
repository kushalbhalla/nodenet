import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowPostComponent } from './show-post/show-post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostComponent } from './post.component';

const routes: Routes = [
  { path: '', redirectTo:'create'},
  { path: 'create', component: CreatePostComponent },
  { path: ':id/view', component: ShowPostComponent },
  { path: ':id/edit', component: CreatePostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
