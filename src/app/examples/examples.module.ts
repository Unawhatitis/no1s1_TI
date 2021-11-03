import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { AgmCoreModule } from '@agm/core';
import { ExamplesComponent } from './examples.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BrowserModule } from '@angular/platform-browser';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        JwBootstrapSwitchNg2Module,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_KEY_HERE'
        }),
        NgxQRCodeModule,
        BrowserModule,
        QRCodeModule,

    ],
    declarations: [
        //LandingComponent,
        //LoginComponent,
        ExamplesComponent,
        //ProfileComponent,
        //ProfileRMComponent
    ]
})
export class ExamplesModule { }
