import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { ReadMeComponent } from './ReadMe/ReadMe.component';
import { LoginComponent } from '../components/login/login.component';
import { TeamComponent } from '../components/Team/Team.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ComponentsComponent } from './components.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        RouterModule,
        JwBootstrapSwitchNg2Module,
        ReactiveFormsModule,
        QRCodeModule
      ],
    declarations: [
        ComponentsComponent,
        ProfileComponent,
        ReadMeComponent,
        LoginComponent,
        TeamComponent

    ],
    exports:[ ComponentsComponent ]
})
export class ComponentsModule { }
