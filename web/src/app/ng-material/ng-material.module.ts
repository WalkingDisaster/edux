import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MdMenuModule,
  MdInputModule,
  MdButtonModule,
  MdIconModule,
  MdCardModule,
  MdSidenavModule,
  MdListModule
} from '@angular/material';

@NgModule({
  imports: [
    MdMenuModule,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdSidenavModule,
    MdListModule
  ],
  exports: [
    MdMenuModule,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    MdSidenavModule,
    MdListModule
  ],
  declarations: []
})
export class NgMaterialModule { }
