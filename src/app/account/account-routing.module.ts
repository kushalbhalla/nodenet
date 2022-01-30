import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { 
    path: '', 
    component: AccountComponent,
    children: [
      { 
        path: '', 
        component: UserComponent
      },
      { 
        path: 'user-edit', 
        component: UserEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
