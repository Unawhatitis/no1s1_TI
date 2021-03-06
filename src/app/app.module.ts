import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';
import { BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
//import { NavbarComponent2 } from './shared/navbar2/navbar.component';
import { BackdoorComponent } from './components/backdoor/backdoor.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { NavbarModule} from './shared/navbar2/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
//import {ComponentsRoutingModule} from'./components/components.rounting';
//import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { BasicelementsComponent } from './examples/basicelements/basicelements.component';
//'../basicelements/basicelements.component';
import { NavigationComponent } from './examples/navigation/navigation.component';
import { TypographyComponent } from './examples/typography/typography.component';
import { NucleoiconsComponent } from './examples/nucleoicons/nucleoicons.component';
//import { ComponentsComponent } from './components/components.component';
import { NotificationComponent } from './examples/notification/notification.component';
import { NgbdModalBasic } from './examples/modal/modal.component';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        BackdoorComponent,
        BasicelementsComponent,
        NavigationComponent,
        TypographyComponent,
        NucleoiconsComponent,
        NotificationComponent,
        NgbdModalBasic,
        TestComponent,
        AdminLayoutComponent,

    ],
    imports: [
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule,
        AppRoutingModule,
        ComponentsModule,
        ExamplesModule,
        BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        SidebarModule,
        FooterModule,
        NavbarModule,
        FixedPluginModule,
        ToastrModule.forRoot(),
        QRCodeModule,


    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
