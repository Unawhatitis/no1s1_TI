import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';
//import { NavbarComponent } from '../shared/navbar/navbar.component';

//import { BasicelementsComponent } from './basicelements/basicelements.component';
// import { NavigationComponent } from './navigation/navigation.component';
// import { TypographyComponent } from './typography/typography.component';
// import { NucleoiconsComponent } from './nucleoicons/nucleoicons.component';
import { ComponentsComponent } from './components.component';
// import { NotificationComponent } from './notification/notification.component';
// import { NgbdModalBasic } from './modal/modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        RouterModule,
        JwBootstrapSwitchNg2Module,
        ReactiveFormsModule
      ],
    declarations: [
        ComponentsComponent,
        //NavbarComponent,
        // BasicelementsComponent,
        // NavigationComponent,
        // TypographyComponent,
        // NucleoiconsComponent,
        // NotificationComponent,
        // NgbdModalBasic
    ],
    exports:[ ComponentsComponent ]
})
export class ComponentsModule { }
