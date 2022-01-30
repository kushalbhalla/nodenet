import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsComponent } from './friends.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    FriendsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class FriendsModule { }
