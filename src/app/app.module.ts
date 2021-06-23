import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';
import { BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BackdoorComponent } from './backdoor/backdoor.component';
//import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { BasicelementsComponent } from './components/basicelements/basicelements.component';
//'../basicelements/basicelements.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TypographyComponent } from './components/typography/typography.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
//import { ComponentsComponent } from './components/components.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NgbdModalBasic } from './components/modal/modal.component';
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
        //ComponentsComponent,
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
        //FormBuilder,FormControl,FormGroup,Validators
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
